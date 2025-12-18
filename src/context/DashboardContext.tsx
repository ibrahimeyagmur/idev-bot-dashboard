import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
  color: string;
}

interface ServerSettings {
  welcome?: {
    enabled: boolean;
    channelId: string;
    messageType: 'normal' | 'embed';
    message: string;
    embed?: {
      title: string;
      description: string;
      color: string;
      thumbnail: string;
      image: string;
      footer: string;
    };
  };
  leave?: {
    enabled: boolean;
    channelId: string;
    messageType: 'normal' | 'embed';
    message: string;
    embed?: {
      title: string;
      description: string;
      color: string;
      thumbnail: string;
      image: string;
      footer: string;
    };
  };
  autoreply?: {
    enabled: boolean;
    rules: Array<{
      id: string;
      keyword: string;
      reply: string;
      match: 'contains' | 'exact';
      enabled: boolean;
    }>;
  };
  automod?: {
    antiAd: {
      enabled: boolean;
      action: 'delete' | 'timeout' | 'warn';
      ignoredChannelIds: string[];
      ignoredRoleIds: string[];
    };
    profanity: {
      enabled: boolean;
      action: 'delete' | 'timeout' | 'warn';
      ignoredChannelIds: string[];
      ignoredRoleIds: string[];
    };
  };
  levels?: {
    enabled: boolean;
    xpPerMessage: number;
    cooldown: number;
    notifyChannel: string;
    notifyType: 'channel' | 'dm' | 'none';
    roleRewards: Array<{
      id: string;
      level: number;
      roleId: string;
    }>;
  };
}

interface DashboardContextType {
  serverId: string | null;
  channels: Channel[];
  roles: Role[];
  settings: ServerSettings;
  isLoading: boolean;
  error: string | null;
  setServerId: (id: string) => void;
  updateSettings: (key: keyof ServerSettings, value: unknown) => void;
  refetchSettings: () => Promise<void>;
  refetchChannels: () => Promise<void>;
  refetchRoles: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

// Cache for server data
const serverDataCache = new Map<string, {
  channels: Channel[];
  roles: Role[];
  settings: ServerSettings;
  timestamp: number;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [serverId, setServerIdState] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [settings, setSettings] = useState<ServerSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServerData = useCallback(async (id: string, forceRefresh = false) => {
    // Check cache first
    const cached = serverDataCache.get(id);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setChannels(cached.channels);
      setRoles(cached.roles);
      setSettings(cached.settings);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [settingsRes, channelsRes, rolesRes] = await Promise.all([
        fetch(`http://localhost:3001/api/server/${id}/settings`, { credentials: 'include' }),
        fetch(`http://localhost:3001/api/server/${id}/channels`, { credentials: 'include' }),
        fetch(`http://localhost:3001/api/server/${id}/roles`, { credentials: 'include' }),
      ]);

      let newSettings: ServerSettings = {};
      let newChannels: Channel[] = [];
      let newRoles: Role[] = [];

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        newSettings = data;
      } else if (settingsRes.status === 429) {
        // Rate limited - use cached data if available
        if (cached) {
          newSettings = cached.settings;
          console.warn('Rate limited on settings, using cached data');
        }
      }

      if (channelsRes.ok) {
        const data = await channelsRes.json();
        newChannels = data.channels || [];
      } else if (channelsRes.status === 429) {
        if (cached) {
          newChannels = cached.channels;
          console.warn('Rate limited on channels, using cached data');
        }
      }

      if (rolesRes.ok) {
        const data = await rolesRes.json();
        newRoles = data.roles || [];
      } else if (rolesRes.status === 429) {
        if (cached) {
          newRoles = cached.roles;
          console.warn('Rate limited on roles, using cached data');
        }
      }

      // Update state
      setChannels(newChannels);
      setRoles(newRoles);
      setSettings(newSettings);

      // Update cache
      serverDataCache.set(id, {
        channels: newChannels,
        roles: newRoles,
        settings: newSettings,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error fetching server data:', err);
      setError('Sunucu verileri yüklenirken hata oluştu');
      
      // Try to use cached data
      if (cached) {
        setChannels(cached.channels);
        setRoles(cached.roles);
        setSettings(cached.settings);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setServerId = useCallback((id: string) => {
    if (id !== serverId) {
      setServerIdState(id);
      fetchServerData(id);
    }
  }, [serverId, fetchServerData]);

  const updateSettings = useCallback((key: keyof ServerSettings, value: unknown) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      
      // Update cache
      if (serverId) {
        const cached = serverDataCache.get(serverId);
        if (cached) {
          serverDataCache.set(serverId, {
            ...cached,
            settings: updated,
            timestamp: Date.now(),
          });
        }
      }
      
      return updated;
    });
  }, [serverId]);

  const refetchSettings = useCallback(async () => {
    if (!serverId) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/server/${serverId}/settings`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        
        // Update cache
        const cached = serverDataCache.get(serverId);
        if (cached) {
          serverDataCache.set(serverId, {
            ...cached,
            settings: data,
            timestamp: Date.now(),
          });
        }
      }
    } catch (err) {
      console.error('Error refetching settings:', err);
    }
  }, [serverId]);

  const refetchChannels = useCallback(async () => {
    if (!serverId) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/server/${serverId}/channels`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels || []);
        
        // Update cache
        const cached = serverDataCache.get(serverId);
        if (cached) {
          serverDataCache.set(serverId, {
            ...cached,
            channels: data.channels || [],
            timestamp: Date.now(),
          });
        }
      }
    } catch (err) {
      console.error('Error refetching channels:', err);
    }
  }, [serverId]);

  const refetchRoles = useCallback(async () => {
    if (!serverId) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/server/${serverId}/roles`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setRoles(data.roles || []);
        
        // Update cache
        const cached = serverDataCache.get(serverId);
        if (cached) {
          serverDataCache.set(serverId, {
            ...cached,
            roles: data.roles || [],
            timestamp: Date.now(),
          });
        }
      }
    } catch (err) {
      console.error('Error refetching roles:', err);
    }
  }, [serverId]);

  return (
    <DashboardContext.Provider
      value={{
        serverId,
        channels,
        roles,
        settings,
        isLoading,
        error,
        setServerId,
        updateSettings,
        refetchSettings,
        refetchChannels,
        refetchRoles,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// Hook to initialize dashboard with server ID
export function useDashboardInit(serverId: string | undefined) {
  const dashboard = useDashboard();
  
  useEffect(() => {
    if (serverId && serverId !== dashboard.serverId) {
      dashboard.setServerId(serverId);
    }
  }, [serverId, dashboard]);
  
  return dashboard;
}
