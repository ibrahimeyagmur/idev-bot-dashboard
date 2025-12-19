import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Palette,
  Image,
  Type,
  FileText,
  LayoutList,
  Eye,
  X,
  Check,
  Copy,
  Send,
  Hash,
} from "lucide-react";
import { Button } from "../ui/Button";
import { DiscordMessagePreview } from "./DiscordMessagePreview";
import type { EmbedData, Channel } from "../../pages/ServerDashboard";

interface Props {
  serverId: string;
  embeds: EmbedData[];
  channels: Channel[];
  onUpdate: (embeds: EmbedData[]) => void;
}

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

const defaultEmbed: Omit<EmbedData, "id"> = {
  title: "",
  description: "",
  color: "#5865F2",
  thumbnail: "",
  image: "",
  footer: "",
  fields: [],
};

export function EmbedBuilder({ serverId, embeds, channels, onUpdate }: Props) {
  const [editingEmbed, setEditingEmbed] = useState<EmbedData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendChannelId, setSendChannelId] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendingEmbedId, setSendingEmbedId] = useState<string | null>(null);
  const [sendError, setSendError] = useState("");

  const getEmbedJson = (embed: EmbedData) => {
    const discordEmbed: any = {};
    if (embed.title) discordEmbed.title = embed.title;
    if (embed.description) discordEmbed.description = embed.description;
    if (embed.color)
      discordEmbed.color = parseInt(embed.color.replace("#", ""), 16);
    if (embed.thumbnail) discordEmbed.thumbnail = { url: embed.thumbnail };
    if (embed.image) discordEmbed.image = { url: embed.image };
    if (embed.footer) discordEmbed.footer = { text: embed.footer };
    if (embed.fields && embed.fields.length > 0) {
      discordEmbed.fields = embed.fields.map((f) => ({
        name: f.name || "\u200b",
        value: f.value || "\u200b",
        inline: f.inline,
      }));
    }
    return JSON.stringify({ embeds: [discordEmbed] }, null, 2);
  };

  const copyJson = (embed: EmbedData) => {
    navigator.clipboard.writeText(getEmbedJson(embed));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSendModal = (embedId: string) => {
    setSendingEmbedId(embedId);
    setSendChannelId("");
    setSendError("");
    setShowSendModal(true);
  };

  const sendEmbed = async () => {
    if (!sendingEmbedId || !sendChannelId) return;

    setSending(true);
    setSendError("");
    try {
      const res = await fetch(
        `http://localhost:3001/api/server/${serverId}/embeds/${sendingEmbedId}/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ channelId: sendChannelId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowSendModal(false);
        setSendingEmbedId(null);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } else {
        setSendError(data.error || "Embed gönderilemedi");
      }
    } catch (err) {
      console.error("Failed to send embed:", err);
      setSendError("Bağlantı hatası");
    } finally {
      setSending(false);
    }
  };

  const createEmbed = () => {
    setEditingEmbed({
      id: "",
      ...defaultEmbed,
    });
    setIsCreating(true);
  };

  const saveEmbed = async () => {
    if (!editingEmbed) return;

    setSaving(true);
    try {
      const url = isCreating
        ? `http://localhost:3001/api/server/${serverId}/embeds`
        : `http://localhost:3001/api/server/${serverId}/embeds/${editingEmbed.id}`;

      const res = await fetch(url, {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingEmbed),
      });

      if (res.ok) {
        const { data } = await res.json();
        if (isCreating) {
          onUpdate([...embeds, data]);
        } else {
          onUpdate(embeds.map((e) => (e.id === data.id ? data : e)));
        }
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          setEditingEmbed(null);
          setIsCreating(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to save embed:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteEmbed = async (id: string) => {
    if (!confirm("Bu gömülü mesajı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/server/${serverId}/embeds/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        onUpdate(embeds.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete embed:", err);
    }
  };

  const addField = () => {
    if (!editingEmbed) return;
    setEditingEmbed({
      ...editingEmbed,
      fields: [...editingEmbed.fields, { name: "", value: "", inline: false }],
    });
  };

  const updateField = (index: number, field: Partial<EmbedField>) => {
    if (!editingEmbed) return;
    const newFields = [...editingEmbed.fields];
    newFields[index] = { ...newFields[index], ...field };
    setEditingEmbed({ ...editingEmbed, fields: newFields });
  };

  const removeField = (index: number) => {
    if (!editingEmbed) return;
    setEditingEmbed({
      ...editingEmbed,
      fields: editingEmbed.fields.filter((_, i) => i !== index),
    });
  };

  const reorderFields = (newOrder: EmbedField[]) => {
    if (!editingEmbed) return;
    setEditingEmbed({ ...editingEmbed, fields: newOrder });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Palette className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Gömülü Mesajlar
              </h2>
              <p className="text-sm text-slate-400">
                Özelleştirilmiş Discord embed mesajları oluşturun
              </p>
            </div>
          </div>
          <Button onClick={createEmbed}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Embed
          </Button>
        </div>
      </motion.div>

      {embeds.length === 0 && !editingEmbed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface border border-dashed border-white/10 rounded-xl p-12 text-center"
        >
          <Palette className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Henüz embed yok
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            İlk gömülü mesajınızı oluşturun
          </p>
          <Button onClick={createEmbed}>
            <Plus className="w-4 h-4 mr-2" />
            Embed Oluştur
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {embeds.map((embed) => (
            <motion.div
              key={embed.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-1 h-16 rounded-full"
                  style={{ backgroundColor: embed.color }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">
                    {embed.title || "Başlıksız Embed"}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-1">
                    {embed.description || "Açıklama yok"}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    {embed.fields.length > 0 && (
                      <span>{embed.fields.length} alan</span>
                    )}
                    {embed.image && <span>Resim var</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyJson(embed)}
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green/5 rounded-lg transition-colors"
                    title="JSON Kopyala"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openSendModal(embed.id)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Kanala Gönder"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingEmbed(embed);
                      setIsCreating(false);
                    }}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteEmbed(embed.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editingEmbed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setEditingEmbed(null);
              setIsCreating(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#12131a] border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {isCreating ? "Yeni Embed Oluştur" : "Embed Düzenle"}
                </h3>
                <button
                  onClick={() => {
                    setEditingEmbed(null);
                    setIsCreating(false);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <Type className="w-4 h-4" />
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={editingEmbed.title}
                        onChange={(e) =>
                          setEditingEmbed({
                            ...editingEmbed,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                        placeholder="Embed başlığı"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <FileText className="w-4 h-4" />
                        Açıklama
                      </label>
                      <textarea
                        value={editingEmbed.description}
                        onChange={(e) =>
                          setEditingEmbed({
                            ...editingEmbed,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                        placeholder="Embed açıklaması"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <Palette className="w-4 h-4" />
                        Renk
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={editingEmbed.color}
                          onChange={(e) =>
                            setEditingEmbed({
                              ...editingEmbed,
                              color: e.target.value,
                            })
                          }
                          className="w-12 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={editingEmbed.color}
                          onChange={(e) =>
                            setEditingEmbed({
                              ...editingEmbed,
                              color: e.target.value,
                            })
                          }
                          className="flex-1 px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                          placeholder="#5865F2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                          <Image className="w-4 h-4" />
                          Thumbnail URL
                        </label>
                        <input
                          type="text"
                          value={editingEmbed.thumbnail}
                          onChange={(e) =>
                            setEditingEmbed({
                              ...editingEmbed,
                              thumbnail: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                          <Image className="w-4 h-4" />
                          Resim URL
                        </label>
                        <input
                          type="text"
                          value={editingEmbed.image}
                          onChange={(e) =>
                            setEditingEmbed({
                              ...editingEmbed,
                              image: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <FileText className="w-4 h-4" />
                        Footer
                      </label>
                      <input
                        type="text"
                        value={editingEmbed.footer}
                        onChange={(e) =>
                          setEditingEmbed({
                            ...editingEmbed,
                            footer: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                        placeholder="Footer metni"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <LayoutList className="w-4 h-4" />
                          Alanlar
                        </label>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={addField}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Alan Ekle
                        </Button>
                      </div>

                      {editingEmbed.fields.length > 0 ? (
                        <Reorder.Group
                          axis="y"
                          values={editingEmbed.fields}
                          onReorder={reorderFields}
                          className="space-y-2"
                        >
                          {editingEmbed.fields.map((field, index) => (
                            <Reorder.Item
                              key={index}
                              value={field}
                              className="bg-surface border border-white/10 rounded-lg p-3"
                            >
                              <div className="flex items-start gap-2">
                                <GripVertical className="w-4 h-4 text-slate-500 mt-2.5 cursor-grab" />
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="text"
                                    value={field.name}
                                    onChange={(e) =>
                                      updateField(index, {
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 bg-[#12131a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent/50"
                                    placeholder="Alan adı"
                                  />
                                  <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) =>
                                      updateField(index, {
                                        value: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 bg-[#12131a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent/50"
                                    placeholder="Alan değeri"
                                  />
                                  <label className="flex items-center gap-2 text-xs text-slate-400">
                                    <input
                                      type="checkbox"
                                      checked={field.inline}
                                      onChange={(e) =>
                                        updateField(index, {
                                          inline: e.target.checked,
                                        })
                                      }
                                      className="rounded border-slate-600"
                                    />
                                    Satır içi
                                  </label>
                                </div>
                                <button
                                  onClick={() => removeField(index)}
                                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      ) : (
                        <div className="text-center py-4 bg-surface border border-dashed border-white/10 rounded-lg">
                          <p className="text-sm text-slate-400">
                            Henüz alan eklenmemiş
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Önizleme
                    </label>
                    <DiscordMessagePreview
                      type="embed"
                      content={editingEmbed.description}
                      embedTitle={editingEmbed.title}
                      embedColor={editingEmbed.color}
                      embedFooter={editingEmbed.footer}
                      embedImage={editingEmbed.image}
                      embedThumbnail={editingEmbed.thumbnail}
                      embedFields={editingEmbed.fields}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={() => copyJson(editingEmbed)}
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Kopyalandı!" : "JSON Kopyala"}
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingEmbed(null);
                      setIsCreating(false);
                    }}
                  >
                    İptal
                  </Button>
                  <Button onClick={saveEmbed} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : saved ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saved ? "Kaydedildi!" : "Kaydet"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#12131a] border border-white/10 rounded-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Embed Gönder
              </h3>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Hash className="w-4 h-4" />
                  Kanal Seçin
                </label>
                <select
                  value={sendChannelId}
                  onChange={(e) => setSendChannelId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                >
                  <option value="">Kanal seçin</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name}
                    </option>
                  ))}
                </select>
              </div>

              {sendError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{sendError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowSendModal(false)}
                >
                  İptal
                </Button>
                <Button
                  onClick={sendEmbed}
                  disabled={sending || !sendChannelId}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Gönder
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            JSON kopyalandı!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Embed gönderildi!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
