import { Bot } from 'lucide-react';

interface Props {
  type: 'normal' | 'embed';
  content: string;
  username?: string;
  embedColor?: string;
  embedTitle?: string;
  embedFooter?: string;
  embedImage?: string;
  embedThumbnail?: string;
  embedFields?: { name: string; value: string; inline: boolean }[];
}

export function DiscordMessagePreview({
  type,
  content,
  username = 'GenelBot',
  embedColor = '#5865F2',
  embedTitle,
  embedFooter,
  embedImage,
  embedThumbnail,
  embedFields = [],
}: Props) {
  const timestamp = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#313338] rounded-lg p-4 font-['gg_sans',_'Noto_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif]">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{username}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#5865F2] text-white rounded">BOT</span>
            <span className="text-xs text-[#949BA4]">Bugün {timestamp}</span>
          </div>

          {/* Message Content */}
          {type === 'normal' ? (
            <p className="text-[#DBDEE1] text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          ) : (
            <div className="mt-1">
              {/* Embed */}
              <div 
                className="max-w-[520px] rounded overflow-hidden"
                style={{ borderLeft: `4px solid ${embedColor}` }}
              >
                <div className="bg-[#2B2D31] p-3">
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      {embedTitle && (
                        <h4 className="font-semibold text-white mb-1">{embedTitle}</h4>
                      )}
                      <p className="text-[#DBDEE1] text-sm whitespace-pre-wrap break-words">
                        {content}
                      </p>

                      {/* Fields */}
                      {embedFields.length > 0 && (
                        <div className="grid gap-2 mt-2" style={{ 
                          gridTemplateColumns: embedFields.some(f => f.inline) 
                            ? 'repeat(auto-fill, minmax(150px, 1fr))' 
                            : '1fr' 
                        }}>
                          {embedFields.map((field, i) => (
                            <div key={i} className={field.inline ? '' : 'col-span-full'}>
                              <div className="text-xs font-semibold text-white">{field.name}</div>
                              <div className="text-sm text-[#DBDEE1]">{field.value}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Image */}
                      {embedImage && (
                        <img 
                          src={embedImage} 
                          alt="" 
                          className="mt-2 rounded max-w-full h-auto"
                          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                      )}
                    </div>

                    {/* Thumbnail */}
                    {embedThumbnail && (
                      <div className="flex-shrink-0">
                        <img 
                          src={embedThumbnail} 
                          alt="" 
                          className="w-20 h-20 rounded object-cover"
                          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {embedFooter && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <span className="text-xs text-[#949BA4]">{embedFooter}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
