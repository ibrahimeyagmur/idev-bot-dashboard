import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDashboardInit } from '../../context/DashboardContext';
import { EmbedBuilder } from '../../components/server/EmbedBuilder';
import { Loader2 } from 'lucide-react';

interface EmbedData {
  id: string;
  title: string;
  description: string;
  color: string;
  thumbnail: string;
  image: string;
  footer: string;
  fields: { name: string; value: string; inline: boolean }[];
}

export function EmbedsPage() {
  const { serverId } = useParams();
  const { channels, settings, isLoading: contextLoading } = useDashboardInit(serverId);
  const [embeds, setEmbeds] = useState<EmbedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use cached data from context
  useEffect(() => {
    if (!contextLoading && settings) {
      setEmbeds((settings as any).embeds || []);
      setIsLoading(false);
    }
  }, [contextLoading, settings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Gömülü Mesajlar</h1>
        <p className="text-slate-400">
          Profesyonel görünümlü embed mesajlar oluşturun ve yönetin.
        </p>
      </div>

      <EmbedBuilder
        serverId={serverId!}
        embeds={embeds}
        channels={channels}
        onUpdate={setEmbeds}
      />
    </div>
  );
}
