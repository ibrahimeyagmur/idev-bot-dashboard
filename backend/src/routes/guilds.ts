import { Router } from 'express';
import db from 'croxydb';
import { requireAuth } from '../middlewares/requireAuth';
import { getUserGuilds, isManageable } from '../services/discordApi';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const accessToken = req.session.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token' });
    }

    const allGuilds = await getUserGuilds(accessToken);
    
    const botGuildIds = new Set<string>(db.get('bot.guildIds') || []);

    const guilds = allGuilds.map((guild) => {
      const manageable = guild.owner || isManageable(guild.permissions);
      return {
        id: guild.id,
        name: guild.name,
        icon: guild.icon 
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null,
        permissions: guild.permissions,
        isManageable: manageable,
        botInstalled: botGuildIds.has(guild.id),
      };
    });

    guilds.sort((a, b) => {
      if (a.isManageable && !b.isManageable) return -1;
      if (!a.isManageable && b.isManageable) return 1;
      return a.name.localeCompare(b.name);
    });

    res.json({ guilds });
  } catch (error: any) {
    console.log(`⚠️ Sunucular alınamadı: ${error.message || 'Bilinmeyen hata'}`);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

router.post('/register-bot', requireAuth, (req, res) => {
  const { guildId } = req.body;
  
  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'guildId is required' });
  }

  const botGuildIds: string[] = db.get('bot.guildIds') || [];
  if (!botGuildIds.includes(guildId)) {
    botGuildIds.push(guildId);
    db.set('bot.guildIds', botGuildIds);
  }

  res.json({ success: true });
});

router.post('/unregister-bot', requireAuth, (req, res) => {
  const { guildId } = req.body;
  
  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'guildId is required' });
  }

  const botGuildIds: string[] = db.get('bot.guildIds') || [];
  const filtered = botGuildIds.filter(id => id !== guildId);
  db.set('bot.guildIds', filtered);

  res.json({ success: true });
});

router.get('/:id/settings', requireAuth, (req, res) => {
  const { id } = req.params;
  
  const settings = db.get(`settings.${id}`) || {
    welcome: false,
    level: false,
    embed: false,
    reactionRoles: false,
    welcomeChannel: null,
    welcomeMessage: 'Hoş geldin {user}!',
    levelUpChannel: null,
    levelUpMessage: 'Tebrikler {user}! Artık seviye {level}!',
  };

  res.json(settings);
});

router.put('/:id/settings', requireAuth, (req, res) => {
  const { id } = req.params;
  const newSettings = req.body;

  const existingSettings = db.get(`settings.${id}`) || {};
  
  const updatedSettings = {
    ...existingSettings,
    ...newSettings,
    updatedAt: Date.now(),
  };

  db.set(`settings.${id}`, updatedSettings);

  res.json(updatedSettings);
});

export default router;
