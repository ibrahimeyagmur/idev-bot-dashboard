import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardProvider } from '../../context/DashboardContext';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { Button } from '../ui/Button';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  botInstalled: boolean;
  isManageable: boolean;
}

export function DashboardLayout() {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user guilds
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchGuilds = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/guilds', { credentials: 'include' });
        if (!res.ok) throw new Error('Sunucular yüklenemedi');
        const data = await res.json();
        setGuilds(data.guilds || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuilds();
  }, [isLoggedIn]);

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    navigate('/');
    return null;
  }

  // Loading guilds
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const currentGuild = guilds.find(g => g.id === serverId) || null;
  const manageableGuilds = guilds.filter(g => g.isManageable);

  // Check if user has permission to manage this guild
  if (serverId && currentGuild && !currentGuild.isManageable) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Yetkisiz Erişim</h1>
          <p className="text-slate-400 mb-6">
            Bu sunucuyu yönetmek için gerekli izinlere sahip değilsiniz.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Sunucu Seçimine Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <DashboardSidebar guilds={manageableGuilds} currentGuild={currentGuild} />
        <DashboardTopbar 
          title={getPageTitle()} 
          breadcrumbs={getBreadcrumbs()}
        />
        
        <main className="ml-64 pt-16 min-h-screen">
          <div className="p-6">
            {/* Bot not installed warning */}
            {serverId && currentGuild && !currentGuild.botInstalled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-amber-300">
                      Bot bu sunucuda kurulu değil
                    </p>
                    <p className="text-xs text-amber-400/70">
                      Özellikleri kullanmak için botu sunucunuza ekleyin.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
                    window.open(
                      `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${serverId}`,
                      '_blank'
                    );
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Botu Ekle
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet context={{ guilds: manageableGuilds, currentGuild }} />
            </motion.div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );

  function getPageTitle(): string {
    const path = window.location.pathname;
    if (path.includes('/settings')) return 'Ayarlar';
    if (path.includes('/welcome')) return 'Karşılama & Veda';
    if (path.includes('/levels')) return 'Seviye Sistemi';
    if (path.includes('/embeds')) return 'Gömülü Mesajlar';
    if (path.includes('/automod')) return 'Otomatik Moderasyon';
    if (path.includes('/autoreply')) return 'Otomatik Cevap';
    if (serverId) return 'Kontrol Paneli';
    return 'Dashboard';
  }

  function getBreadcrumbs(): { label: string; path?: string }[] {
    if (!serverId || !currentGuild) return [];
    return [
      { label: currentGuild.name, path: `/dashboard/${serverId}` }
    ];
  }
}
