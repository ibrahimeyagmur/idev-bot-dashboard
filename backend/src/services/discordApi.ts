import axios, { AxiosError } from 'axios';

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const MAX_RETRIES = 5;
const CACHE_TTL = 60 * 1000;

const guildsCache = new Map<string, { guilds: DiscordGuild[]; timestamp: number }>();

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

async function discordRequest<T>(url: string, accessToken: string, retries = 0): Promise<T> {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ retry_after?: number; message?: string }>;
    
    if (axiosError.response?.status === 429 && retries < MAX_RETRIES) {
      const retryAfter = axiosError.response.data?.retry_after || (retries + 1);
      const delay = Math.min(retryAfter * 1000 + (retries * 500), 10000);
      console.log(`⚠️ Rate limit, retrying in ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return discordRequest<T>(url, accessToken, retries + 1);
    }
    
    if (axiosError.response?.status === 429) {
      console.log(`⚠️ Discord API limit aşıldı - max retries reached`);
    }
    
    throw new Error(`Discord API Error: ${axiosError.response?.status || 'Unknown'}`);
  }
}

export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  return discordRequest<DiscordUser>(`${DISCORD_API_BASE}/users/@me`, accessToken);
}

export async function getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const cached = guildsCache.get(accessToken);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.guilds;
  }
  
  const guilds = await discordRequest<DiscordGuild[]>(`${DISCORD_API_BASE}/users/@me/guilds`, accessToken);
  
  guildsCache.set(accessToken, { guilds, timestamp: Date.now() });
  
  return guilds;
}

export function getAvatarUrl(user: DiscordUser): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  const defaultAvatarIndex = parseInt(user.id) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
}

const ADMINISTRATOR = BigInt(0x8);
const MANAGE_GUILD = BigInt(0x20);

export function isManageable(permissions: string): boolean {
  const perm = BigInt(permissions);
  return (perm & ADMINISTRATOR) === ADMINISTRATOR || (perm & MANAGE_GUILD) === MANAGE_GUILD;
}

export function hasManageGuildPermission(permissions: string): boolean {
  return isManageable(permissions);
}
