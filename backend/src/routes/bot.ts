import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

const BOT_PERMISSIONS = '8';

router.get('/invite', requireAuth, (req, res) => {
  const { guildId } = req.query;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ error: 'Bot client ID not configured' });
  }

  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'guildId is required' });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'bot applications.commands',
    permissions: BOT_PERMISSIONS,
    guild_id: guildId,
    disable_guild_select: 'true',
    response_type: 'code',
  });

  const url = `https://discord.com/oauth2/authorize?${params.toString()}`;

  res.json({ url });
});

export default router;
