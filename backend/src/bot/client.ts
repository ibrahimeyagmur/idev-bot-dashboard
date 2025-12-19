import {
  Client,
  GatewayIntentBits,
  Events,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import db from "croxydb";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const xpCooldowns = new Map<string, number>();

function calculateLevel(xp: number): number {
  return Math.floor(0.1 * Math.sqrt(xp));
}

function xpForLevel(level: number): number {
  return Math.pow(level / 0.1, 2);
}

client.once(Events.ClientReady, (c) => {
  console.log(`🤖 Bot aktif: ${c.user.tag}`);

  const guildIds = c.guilds.cache.map((g) => g.id);
  db.set("bot.guildIds", guildIds);
  console.log(`📊 ${guildIds.length} sunucu senkronize edildi`);
});

client.on(Events.GuildCreate, (guild) => {
  console.log(`➕ Yeni sunucuya katıldı: ${guild.name}`);
  const guildIds: string[] = db.get("bot.guildIds") || [];
  if (!guildIds.includes(guild.id)) {
    guildIds.push(guild.id);
    db.set("bot.guildIds", guildIds);
  }
});

client.on(Events.GuildDelete, (guild) => {
  console.log(`➖ Sunucudan ayrıldı: ${guild.name}`);
  const guildIds: string[] = db.get("bot.guildIds") || [];
  const filtered = guildIds.filter((id) => id !== guild.id);
  db.set("bot.guildIds", filtered);
});

client.on(Events.GuildMemberAdd, async (member) => {
  console.log(
    `[Welcome] Üye katıldı: ${member.user.tag} -> ${member.guild.name}`
  );

  const settings = db.get(`guildSettings.${member.guild.id}.welcome`);
  console.log(`[Welcome] Ayarlar:`, JSON.stringify(settings));

  if (!settings?.enabled) {
    console.log(`[Welcome] Sistem kapalı`);
    return;
  }

  if (!settings?.channelId) {
    console.log(`[Welcome] Kanal seçilmemiş!`);
    return;
  }

  const channel = member.guild.channels.cache.get(
    settings.channelId
  ) as TextChannel;
  if (!channel) return;

  const message = (settings.message || "Hoş geldin {user}!")
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{server}/g, member.guild.name)
    .replace(/{count}/g, member.guild.memberCount.toString());

  try {
    if (settings.messageType === "embed") {
      const embedData = settings.embed || {};
      const description = (
        embedData.description ||
        settings.message ||
        "Hoş geldin {user}!"
      )
        .replace(/{user}/g, `<@${member.id}>`)
        .replace(/{server}/g, member.guild.name)
        .replace(/{count}/g, member.guild.memberCount.toString());

      const embed = new EmbedBuilder().setColor(
        parseInt((embedData.color || "#57F287").replace("#", ""), 16)
      );

      if (embedData.title) {
        const title = embedData.title
          .replace(/{user}/g, member.user.username)
          .replace(/{server}/g, member.guild.name)
          .replace(/{count}/g, member.guild.memberCount.toString());
        embed.setTitle(title);
      }

      embed.setDescription(description);

      if (embedData.thumbnail) {
        embed.setThumbnail(embedData.thumbnail);
      } else {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      }

      if (embedData.image) embed.setImage(embedData.image);
      if (embedData.footer) embed.setFooter({ text: embedData.footer });

      embed.setTimestamp();
      await channel.send({ embeds: [embed] });
    } else {
      await channel.send(message);
    }
  } catch (err) {
    console.error("Karşılama mesajı gönderilemedi:", err);
  }
});

client.on(Events.GuildMemberRemove, async (member) => {
  console.log(
    `[Leave] Üye ayrıldı: ${member.user?.tag} -> ${member.guild.name}`
  );

  const settings = db.get(`guildSettings.${member.guild.id}.leave`);
  console.log(`[Leave] Ayarlar:`, JSON.stringify(settings));

  if (!settings?.enabled) {
    console.log(`[Leave] Sistem kapalı`);
    return;
  }

  if (!settings?.channelId) {
    console.log(`[Leave] Kanal seçilmemiş!`);
    return;
  }

  const channel = member.guild.channels.cache.get(
    settings.channelId
  ) as TextChannel;
  if (!channel) return;

  const message = (settings.message || "{user} aramızdan ayrıldı.")
    .replace(/{user}/g, member.user?.username || "Bilinmeyen")
    .replace(/{server}/g, member.guild.name)
    .replace(/{count}/g, member.guild.memberCount.toString());

  try {
    if (settings.messageType === "embed") {
      const embedData = settings.embed || {};
      const description = (
        embedData.description ||
        settings.message ||
        "{user} aramızdan ayrıldı."
      )
        .replace(/{user}/g, member.user?.username || "Bilinmeyen")
        .replace(/{server}/g, member.guild.name)
        .replace(/{count}/g, member.guild.memberCount.toString());

      const embed = new EmbedBuilder().setColor(
        parseInt((embedData.color || "#ED4245").replace("#", ""), 16)
      );

      if (embedData.title) {
        const title = embedData.title
          .replace(/{user}/g, member.user?.username || "Bilinmeyen")
          .replace(/{server}/g, member.guild.name)
          .replace(/{count}/g, member.guild.memberCount.toString());
        embed.setTitle(title);
      }

      embed.setDescription(description);

      if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail);
      if (embedData.image) embed.setImage(embedData.image);
      if (embedData.footer) embed.setFooter({ text: embedData.footer });

      embed.setTimestamp();
      await channel.send({ embeds: [embed] });
    } else {
      await channel.send(message);
    }
  } catch (err) {
    console.error("Veda mesajı gönderilemedi:", err);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  const settings = db.get(`guildSettings.${message.guild.id}.levels`);
  if (!settings?.enabled) return;

  const cooldownKey = `${message.guild.id}-${message.author.id}`;
  const now = Date.now();
  const cooldownMs = (settings.cooldown || 60) * 1000;

  const lastXp = xpCooldowns.get(cooldownKey) || 0;
  if (now - lastXp < cooldownMs) return;

  xpCooldowns.set(cooldownKey, now);

  const userKey = `levels.${message.guild.id}.${message.author.id}`;
  const userData = db.get(userKey) || { xp: 0, level: 0, messages: 0 };

  const oldLevel = userData.level;
  const xpGain = settings.xpPerMessage || 15;

  userData.xp += xpGain;
  userData.messages += 1;
  userData.level = calculateLevel(userData.xp);

  db.set(userKey, userData);

  if (userData.level > oldLevel) {
    const levelUpMessage = (
      settings.levelUpMessage || "🎉 {user} seviye {level} oldu!"
    )
      .replace(/{user}/g, `<@${message.author.id}>`)
      .replace(/{level}/g, userData.level.toString())
      .replace(/{xp}/g, userData.xp.toString());

    let channel: TextChannel | null = null;
    if (settings.levelUpChannelId) {
      channel = message.guild.channels.cache.get(
        settings.levelUpChannelId
      ) as TextChannel;
    }
    if (!channel) {
      channel = message.channel as TextChannel;
    }

    try {
      const embed = new EmbedBuilder()
        .setDescription(levelUpMessage)
        .setColor(0x5865f2)
        .setFooter({ text: `Toplam XP: ${userData.xp}` });
      await channel.send({ embeds: [embed] });
    } catch (err) {}

    if (settings.roles && settings.roles.length > 0) {
      for (const roleReward of settings.roles) {
        if (roleReward.level === userData.level && roleReward.roleId) {
          try {
            const role = message.guild.roles.cache.get(roleReward.roleId);
            if (role && message.member) {
              await message.member.roles.add(role);
            }
          } catch (err) {}
        }
      }
    }
  }
});

const adPatterns = [
  /discord\.gg\/\w+/i,
  /discord\.com\/invite\/\w+/i,
  /discordapp\.com\/invite\/\w+/i,
  /https?:\/\/[^\s]+/i,
];

const profanityList = [
  "amk",
  "aq",
  "amına",
  "amina",
  "amını",
  "amini",
  "amcık",
  "amcik",
  "orospu",
  "oç",
  "oc",
  "piç",
  "pic",
  "sik",
  "sikik",
  "sikim",
  "sikeyim",
  "yarrak",
  "yarak",
  "taşak",
  "tasak",
  "göt",
  "got",
  "meme",
  "ananı",
  "anani",
  "ananın",
  "ananin",
  "bacını",
  "bacini",
  "pezevenk",
  "kahpe",
  "ibne",
  "top",
  "gavat",
  "siktir",
  "sg",
  "amq",
  "mk",
  "awk",
];

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild || !message.member) return;

  const automod = db.get(`guildSettings.${message.guild.id}.automod`);
  if (!automod) return;

  const isIgnored = (settings: any) => {
    if (settings.ignoredChannelIds?.includes(message.channel.id)) return true;
    if (
      settings.ignoredRoleIds?.some((roleId: string) =>
        message.member?.roles.cache.has(roleId)
      )
    )
      return true;
    return false;
  };

  if (automod.antiAd?.enabled && !isIgnored(automod.antiAd)) {
    const hasAd = adPatterns.some((pattern) => pattern.test(message.content));
    if (hasAd) {
      try {
        const action = automod.antiAd.action || "delete";

        if (action === "delete" || action === "timeout" || action === "warn") {
          await message.delete();
        }

        if (action === "timeout" && message.member.moderatable) {
          await message.member.timeout(5 * 60 * 1000, "Reklam/link paylaşımı");
        }

        if (action === "warn") {
          const channel = message.channel as TextChannel;
          await channel.send({
            content: `⚠️ <@${message.author.id}>, reklam veya link paylaşımı yasaktır!`,
          });
        }
      } catch {}
      return;
    }
  }

  if (automod.profanity?.enabled && !isIgnored(automod.profanity)) {
    const lowerContent = message.content.toLowerCase();
    const hasProfanity = profanityList.some((word) =>
      lowerContent.includes(word.toLowerCase())
    );

    if (hasProfanity) {
      try {
        const action = automod.profanity.action || "delete";

        if (action === "delete" || action === "timeout" || action === "warn") {
          await message.delete();
        }

        if (action === "timeout" && message.member.moderatable) {
          await message.member.timeout(5 * 60 * 1000, "Uygunsuz içerik");
        }

        if (action === "warn") {
          const channel = message.channel as TextChannel;
          await channel.send({
            content: `⚠️ <@${message.author.id}>, uygunsuz içerik paylaşımı yasaktır!`,
          });
        }
      } catch {}
      return;
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  const autoreply = db.get(`guildSettings.${message.guild.id}.autoreply`);
  if (!autoreply?.enabled || !autoreply?.rules?.length) return;

  const content = message.content.toLowerCase();

  for (const rule of autoreply.rules) {
    if (!rule.enabled) continue;
    if (!rule.keyword || !rule.reply) continue;

    const keyword = rule.keyword.toLowerCase();
    let matches = false;

    if (rule.match === "exact") {
      matches = content === keyword;
    } else {
      matches = content.includes(keyword);
    }

    if (matches) {
      try {
        await message.reply(rule.reply);
      } catch {}
      break;
    }
  }
});

export async function startBot(): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token || token === "YOUR_BOT_TOKEN_HERE") {
    console.log("⚠️  DISCORD_BOT_TOKEN ayarlanmamış. Bot başlatılmadı.");
    return;
  }

  try {
    await client.login(token);
  } catch (err) {
    console.error("❌ Bot başlatılamadı:", err);
  }
}

export { client };
