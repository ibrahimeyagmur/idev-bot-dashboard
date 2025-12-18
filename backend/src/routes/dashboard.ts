import { Router } from 'express';
import db from 'croxydb';
import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

router.get('/summary', requireAuth, (req, res) => {
  const { guildId } = req.query;

  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'guildId is required' });
  }

  const guildData = db.get(`guilds.${guildId}`) || {};
  const settings = db.get(`settings.${guildId}`) || {};

  res.json({
    members: guildData.memberCount || Math.floor(Math.random() * 10000) + 100,
    online: guildData.onlineCount || Math.floor(Math.random() * 500) + 10,
    messages: guildData.messageCount || Math.floor(Math.random() * 50000) + 1000,
    plan: guildData.plan || 'FREE',
    settings: {
      welcome: settings.welcome || false,
      level: settings.level || false,
      embed: settings.embed || false,
      reactionRoles: settings.reactionRoles || false,
    },
  });
});

router.get('/activity', requireAuth, (req, res) => {
  const { guildId } = req.query;

  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'guildId is required' });
  }

  const activity = [
    { type: 'member_join', user: 'User123', timestamp: Date.now() - 1000 * 60 * 5 },
    { type: 'level_up', user: 'User456', level: 10, timestamp: Date.now() - 1000 * 60 * 15 },
    { type: 'command_used', command: '/ban', user: 'Moderator', timestamp: Date.now() - 1000 * 60 * 30 },
    { type: 'settings_changed', setting: 'welcome', user: 'Admin', timestamp: Date.now() - 1000 * 60 * 60 },
  ];

  res.json(activity);
});

export default router;
