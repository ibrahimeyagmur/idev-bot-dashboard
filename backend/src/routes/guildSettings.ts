import { Router } from 'express';
import db from 'croxydb';
import { ChannelType } from 'discord.js';
import { requireAuth } from '../middlewares/requireAuth';
import { requireGuildPermission } from '../middlewares/requireGuildPermission';
import { client } from '../bot/client';

const router = Router();

router.use('/:serverId', requireAuth, requireGuildPermission);

router.get('/:serverId/settings', (req, res) => {
  const { serverId } = req.params;
  const guild = (req as any).guild;

  const settings = {
    guild: {
      id: guild.id,
      name: guild.name,
      icon: guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        : null,
    },
    welcome: db.get(`guildSettings.${serverId}.welcome`) || {
      enabled: false,
      channelId: '',
      messageType: 'normal',
      message: 'Hoş geldin {user}, {server} sunucusuna katıldın! 🎉',
    },
    leave: db.get(`guildSettings.${serverId}.leave`) || {
      enabled: false,
      channelId: '',
      messageType: 'normal',
      message: '{user} aramızdan ayrıldı 😢',
    },
    levels: db.get(`guildSettings.${serverId}.levels`) || {
      enabled: false,
      xpPerMessage: 15,
      cooldown: 60,
      levelUpMessage: '🎉 {user} seviye {level} oldu!',
      levelUpChannelId: '',
      roles: [],
    },
    embeds: db.get(`guildSettings.${serverId}.embeds`) || [],
    automod: db.get(`guildSettings.${serverId}.automod`) || {
      antiAd: {
        enabled: false,
        action: 'delete',
        ignoredChannelIds: [],
        ignoredRoleIds: [],
      },
      profanity: {
        enabled: false,
        action: 'delete',
        ignoredChannelIds: [],
        ignoredRoleIds: [],
      },
    },
    autoreply: db.get(`guildSettings.${serverId}.autoreply`) || {
      enabled: false,
      rules: [],
    },
  };

  res.json(settings);
});

router.get('/:serverId/channels', (req, res) => {
  const { serverId } = req.params;
  
  const guild = client.guilds.cache.get(serverId);
  if (!guild) {
    return res.json({ channels: [] });
  }
  
  const channels = guild.channels.cache
    .filter(ch => ch.type === ChannelType.GuildText)
    .map(ch => ({
      id: ch.id,
      name: ch.name,
      type: 'text',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  res.json({ channels });
});

router.get('/:serverId/roles', (req, res) => {
  const { serverId } = req.params;
  
  const guild = client.guilds.cache.get(serverId);
  if (!guild) {
    return res.json({ roles: [] });
  }
  
  const roles = guild.roles.cache
    .filter(role => !role.managed && role.name !== '@everyone')
    .map(role => ({
      id: role.id,
      name: role.name,
      color: role.hexColor,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  res.json({ roles });
});

router.put('/:serverId/welcome', (req, res) => {
  const { serverId } = req.params;
  const { enabled, channelId, messageType, message, embed } = req.body;

  const welcomeSettings = {
    enabled: Boolean(enabled),
    channelId: channelId || '',
    messageType: messageType || 'normal',
    message: message || 'Hoş geldin {user}, {server} sunucusuna katıldın! 🎉',
    embed: embed ? {
      title: embed.title || '',
      description: embed.description || '',
      color: embed.color || '#5865F2',
      thumbnail: embed.thumbnail || '',
      image: embed.image || '',
      footer: embed.footer || '',
    } : undefined,
  };

  const guildSettings = db.get(`guildSettings.${serverId}`) || {};
  guildSettings.welcome = welcomeSettings;
  db.set(`guildSettings.${serverId}`, guildSettings);

  console.log(`[Welcome] Saved settings for ${serverId}:`, JSON.stringify(welcomeSettings));
  res.json({ success: true, data: welcomeSettings });
});

router.put('/:serverId/leave', (req, res) => {
  const { serverId } = req.params;
  const { enabled, channelId, messageType, message, embed } = req.body;

  const leaveSettings = {
    enabled: Boolean(enabled),
    channelId: channelId || '',
    messageType: messageType || 'normal',
    message: message || '{user} aramızdan ayrıldı 😢',
    embed: embed ? {
      title: embed.title || '',
      description: embed.description || '',
      color: embed.color || '#ED4245',
      thumbnail: embed.thumbnail || '',
      image: embed.image || '',
      footer: embed.footer || '',
    } : undefined,
  };

  const guildSettings = db.get(`guildSettings.${serverId}`) || {};
  guildSettings.leave = leaveSettings;
  db.set(`guildSettings.${serverId}`, guildSettings);

  console.log(`[Leave] Saved settings for ${serverId}:`, JSON.stringify(leaveSettings));
  res.json({ success: true, data: leaveSettings });
});

router.put('/:serverId/levels', (req, res) => {
  const { serverId } = req.params;
  const { enabled, xpPerMessage, cooldown, levelUpMessage, levelUpChannelId, roles } = req.body;

  const levelSettings = {
    enabled: Boolean(enabled),
    xpPerMessage: Math.max(1, Math.min(100, Number(xpPerMessage) || 15)),
    cooldown: Math.max(0, Math.min(300, Number(cooldown) || 60)),
    levelUpMessage: levelUpMessage || '🎉 {user} seviye {level} oldu!',
    levelUpChannelId: levelUpChannelId || '',
    roles: Array.isArray(roles) ? roles : [],
  };

  db.set(`guildSettings.${serverId}.levels`, levelSettings);

  res.json({ success: true, data: levelSettings });
});

router.get('/:serverId/embeds', (req, res) => {
  const { serverId } = req.params;
  const embeds = db.get(`guildSettings.${serverId}.embeds`) || [];
  console.log(`[Embeds] GET embeds for ${serverId}:`, embeds.length);
  res.json({ embeds });
});

router.post('/:serverId/embeds', (req, res) => {
  const { serverId } = req.params;
  const { title, description, color, thumbnail, image, footer, fields } = req.body;

  const embed = {
    id: Date.now().toString(),
    title: title || '',
    description: description || '',
    color: color || '#5865F2',
    thumbnail: thumbnail || '',
    image: image || '',
    footer: footer || '',
    fields: Array.isArray(fields) ? fields : [],
    createdAt: new Date().toISOString(),
  };

  const guildSettings = db.get(`guildSettings.${serverId}`) || {};
  const currentEmbeds = guildSettings.embeds || [];
  currentEmbeds.push(embed);
  guildSettings.embeds = currentEmbeds;
  
  db.set(`guildSettings.${serverId}`, guildSettings);
  
  console.log(`[Embeds] Created embed for ${serverId}:`, embed.id);
  console.log(`[Embeds] Total embeds:`, currentEmbeds.length);

  res.json({ success: true, data: embed });
});

router.put('/:serverId/embeds/:embedId', (req, res) => {
  const { serverId, embedId } = req.params;
  const { title, description, color, thumbnail, image, footer, fields } = req.body;

  const guildSettings = db.get(`guildSettings.${serverId}`) || {};
  const embeds = guildSettings.embeds || [];
  const index = embeds.findIndex((e: any) => e.id === embedId);

  if (index === -1) {
    return res.status(404).json({ error: 'Embed bulunamadı' });
  }

  embeds[index] = {
    ...embeds[index],
    title: title || '',
    description: description || '',
    color: color || '#5865F2',
    thumbnail: thumbnail || '',
    image: image || '',
    footer: footer || '',
    fields: Array.isArray(fields) ? fields : [],
    updatedAt: new Date().toISOString(),
  };

  guildSettings.embeds = embeds;
  db.set(`guildSettings.${serverId}`, guildSettings);

  console.log(`[Embeds] Updated embed ${embedId} for ${serverId}`);
  res.json({ success: true, data: embeds[index] });
});

router.delete('/:serverId/embeds/:embedId', (req, res) => {
  const { serverId, embedId } = req.params;

  const guildSettings = db.get(`guildSettings.${serverId}`) || {};
  const embeds = guildSettings.embeds || [];
  guildSettings.embeds = embeds.filter((e: any) => e.id !== embedId);
  db.set(`guildSettings.${serverId}`, guildSettings);

  console.log(`[Embeds] Deleted embed ${embedId} for ${serverId}`);
  res.json({ success: true });
});

router.post('/:serverId/embeds/:embedId/send', async (req, res) => {
  const { serverId, embedId } = req.params;
  const { channelId } = req.body;

  if (!channelId) {
    return res.status(400).json({ error: 'Kanal ID gerekli' });
  }

  const embeds = db.get(`guildSettings.${serverId}.embeds`) || [];
  const embed = embeds.find((e: any) => e.id === embedId);

  if (!embed) {
    return res.status(404).json({ error: 'Embed bulunamadı' });
  }

  const guild = client.guilds.cache.get(serverId);
  if (!guild) {
    return res.status(404).json({ error: 'Sunucu bulunamadı' });
  }

  const channel = guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) {
    return res.status(404).json({ error: 'Kanal bulunamadı' });
  }

  try {
    const discordEmbed: any = {
      color: parseInt((embed.color || '#5865F2').replace('#', ''), 16),
    };
    if (embed.title) discordEmbed.title = embed.title;
    if (embed.description) discordEmbed.description = embed.description;
    if (embed.thumbnail) discordEmbed.thumbnail = { url: embed.thumbnail };
    if (embed.image) discordEmbed.image = { url: embed.image };
    if (embed.footer) discordEmbed.footer = { text: embed.footer };
    if (embed.fields && embed.fields.length > 0) {
      discordEmbed.fields = embed.fields.map((f: any) => ({
        name: f.name || '\u200b',
        value: f.value || '\u200b',
        inline: f.inline || false
      }));
    }

    await (channel as any).send({ embeds: [discordEmbed] });
    res.json({ success: true });
  } catch (err) {
    console.error('Embed gönderilemedi:', err);
    res.status(500).json({ error: 'Embed gönderilemedi' });
  }
});

router.put('/:serverId/automod/antiad', (req, res) => {
  const { serverId } = req.params;
  const { enabled, action, ignoredChannelIds, ignoredRoleIds } = req.body;

  const automod = db.get(`guildSettings.${serverId}.automod`) || {
    antiAd: { enabled: false, action: 'delete', ignoredChannelIds: [], ignoredRoleIds: [] },
    profanity: { enabled: false, action: 'delete', ignoredChannelIds: [], ignoredRoleIds: [] },
  };

  automod.antiAd = {
    enabled: enabled ?? false,
    action: action || 'delete',
    ignoredChannelIds: ignoredChannelIds || [],
    ignoredRoleIds: ignoredRoleIds || [],
  };

  db.set(`guildSettings.${serverId}.automod`, automod);
  res.json({ success: true, data: automod.antiAd });
});

router.put('/:serverId/automod/profanity', (req, res) => {
  const { serverId } = req.params;
  const { enabled, action, ignoredChannelIds, ignoredRoleIds } = req.body;

  const automod = db.get(`guildSettings.${serverId}.automod`) || {
    antiAd: { enabled: false, action: 'delete', ignoredChannelIds: [], ignoredRoleIds: [] },
    profanity: { enabled: false, action: 'delete', ignoredChannelIds: [], ignoredRoleIds: [] },
  };

  automod.profanity = {
    enabled: enabled ?? false,
    action: action || 'delete',
    ignoredChannelIds: ignoredChannelIds || [],
    ignoredRoleIds: ignoredRoleIds || [],
  };

  db.set(`guildSettings.${serverId}.automod`, automod);
  res.json({ success: true, data: automod.profanity });
});

router.put('/:serverId/autoreply', (req, res) => {
  const { serverId } = req.params;
  const { enabled, rules } = req.body;

  const autoreply = {
    enabled: enabled ?? false,
    rules: Array.isArray(rules) ? rules : [],
  };

  db.set(`guildSettings.${serverId}.autoreply`, autoreply);
  res.json({ success: true, data: autoreply });
});

export default router;
