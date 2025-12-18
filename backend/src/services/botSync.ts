import db from 'croxydb';

export function getBotGuildIds(): string[] {
  return db.get('bot.guildIds') || [];
}
