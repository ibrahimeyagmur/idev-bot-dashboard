import { Request, Response, NextFunction } from 'express';
import { getUserGuilds, isManageable } from '../services/discordApi';
import { getBotGuildIds } from '../services/botSync';

export function requireGuildPermission(req: Request, res: Response, next: NextFunction) {
  const { serverId } = req.params;
  const accessToken = req.session?.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!serverId) {
    return res.status(400).json({ error: 'Server ID required' });
  }

  getUserGuilds(accessToken)
    .then((guilds) => {
      const guild = guilds.find(g => g.id === serverId);

      if (!guild) {
        return res.status(403).json({ error: 'Bu sunucuya erişim yetkiniz yok' });
      }

      const hasPermission = guild.owner || isManageable(guild.permissions);

      if (!hasPermission) {
        return res.status(403).json({ error: 'Bu sunucuyu yönetme yetkiniz yok' });
      }

      const botGuildIds = getBotGuildIds();
      if (!botGuildIds.includes(serverId)) {
        return res.status(403).json({ error: 'Bot bu sunucuda kurulu değil' });
      }

      (req as any).guild = {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        permissions: guild.permissions,
      };

      next();
    })
    .catch((error) => {
      console.error('Guild permission check failed:', error);
      res.status(500).json({ error: 'Yetki kontrolü başarısız' });
    });
}
