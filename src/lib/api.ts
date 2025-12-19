export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  skipCache?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const requestCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();
const CACHE_TTL = 30000; // 30 seconds cache

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(
    endpoint: string,
    params?: Record<string, string>
  ): string {
    return `${endpoint}${params ? JSON.stringify(params) : ""}`;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, skipCache, ...fetchOptions } = options;
    const method = fetchOptions.method || "GET";
    const cacheKey = this.getCacheKey(endpoint, params);

    if (method === "GET" && !skipCache) {
      const cached = requestCache.get(cacheKey) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const pending = pendingRequests.get(cacheKey) as Promise<T> | undefined;
      if (pending) {
        return pending;
      }
    }

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const requestPromise = (async () => {
      const response = await fetch(url, {
        ...fetchOptions,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return this.request<T>(endpoint, options);
        }
        const error = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || error.error || "Request failed");
      }

      return response.json();
    })();

    if (method === "GET") {
      pendingRequests.set(cacheKey, requestPromise);
    }

    try {
      const data = await requestPromise;

      if (method === "GET") {
        requestCache.set(cacheKey, { data, timestamp: Date.now() });
        pendingRequests.delete(cacheKey);
      }

      if (method !== "GET") {
        const serverMatch = endpoint.match(/\/server\/(\d+)/);
        if (serverMatch) {
          for (const key of requestCache.keys()) {
            if (key.includes(`/server/${serverMatch[1]}`)) {
              requestCache.delete(key);
            }
          }
        }
      }

      return data as T;
    } catch (error) {
      pendingRequests.delete(cacheKey);
      throw error;
    }
  }

  clearServerCache(serverId: string): void {
    for (const key of requestCache.keys()) {
      if (key.includes(`/server/${serverId}`)) {
        requestCache.delete(key);
      }
    }
  }

  clearCache(): void {
    requestCache.clear();
    pendingRequests.clear();
  }

  getAuthUrl(): string {
    return `${this.baseUrl}/auth/discord`;
  }

  async getMe(): Promise<User | null> {
    try {
      return await this.request<User>("/auth/me");
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
  }

  async getCommands(search?: string, category?: string): Promise<Command[]> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category && category !== "Tümü") params.category = category;

    return this.request<Command[]>("/api/commands", { params });
  }

  async getCommandCategories(): Promise<string[]> {
    return this.request<string[]>("/api/commands/categories");
  }

  async getPremiumPlans(): Promise<PremiumPlan[]> {
    return this.request<PremiumPlan[]>("/api/premium/plans");
  }

  async getFAQ(): Promise<FAQ[]> {
    return this.request<FAQ[]>("/api/premium/faq");
  }

  async getGuilds(): Promise<GuildsResponse> {
    return this.request<GuildsResponse>("/api/guilds");
  }

  async getGuildSettings(guildId: string): Promise<GuildSettings> {
    return this.request<GuildSettings>(`/api/guilds/${guildId}/settings`);
  }

  async updateGuildSettings(
    guildId: string,
    settings: Partial<GuildSettings>
  ): Promise<GuildSettings> {
    return this.request<GuildSettings>(`/api/guilds/${guildId}/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async getBotInviteUrl(guildId: string): Promise<{ url: string }> {
    return this.request<{ url: string }>("/api/bot/invite", {
      params: { guildId },
    });
  }

  async registerBotGuild(guildId: string): Promise<void> {
    await this.request("/api/guilds/register-bot", {
      method: "POST",
      body: JSON.stringify({ guildId }),
    });
  }

  async unregisterBotGuild(guildId: string): Promise<void> {
    await this.request("/api/guilds/unregister-bot", {
      method: "POST",
      body: JSON.stringify({ guildId }),
    });
  }

  async getDashboardSummary(guildId: string): Promise<DashboardSummary> {
    return this.request<DashboardSummary>("/api/dashboard/summary", {
      params: { guildId },
    });
  }
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  avatar?: string;
  discriminator?: string;
}

export interface Command {
  name: string;
  category: string;
  description: string;
  usage: string;
  examples: string[];
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
  isManageable: boolean;
  botInstalled: boolean;
}

export interface GuildsResponse {
  guilds: Guild[];
}

export interface GuildSettings {
  welcome: boolean;
  level: boolean;
  embed: boolean;
  reactionRoles: boolean;
  welcomeChannel: string | null;
  welcomeMessage: string;
  levelUpChannel: string | null;
  levelUpMessage: string;
}

export interface DashboardSummary {
  members: number;
  online: number;
  messages: number;
  plan: string;
  settings: {
    welcome: boolean;
    level: boolean;
    embed: boolean;
    reactionRoles: boolean;
  };
}

export const api = new ApiClient(API_BASE);
