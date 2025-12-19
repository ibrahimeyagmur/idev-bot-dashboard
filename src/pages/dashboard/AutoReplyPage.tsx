import { useState, useEffect, useRef } from "react";
import { useParams, useBlocker } from "react-router-dom";
import { useDashboardInit } from "../../context/DashboardContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  Check,
  X,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { API_BASE } from "../../lib/api";

interface Rule {
  id: string;
  keyword: string;
  reply: string;
  match: "contains" | "exact";
  enabled: boolean;
}

interface AutoReplySettings {
  enabled: boolean;
  rules: Rule[];
}

export function AutoReplyPage() {
  const { serverId } = useParams();
  const { settings: cachedSettings, isLoading: contextLoading } =
    useDashboardInit(serverId);
  const [settings, setSettings] = useState<AutoReplySettings>({
    enabled: false,
    rules: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [newRule, setNewRule] = useState<Omit<Rule, "id">>({
    keyword: "",
    reply: "",
    match: "contains",
    enabled: true,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const initialDataRef = useRef<AutoReplySettings | null>(null);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowUnsavedModal(true);
      pendingNavigationRef.current = () => blocker.proceed();
    }
  }, [blocker]);

  useEffect(() => {
    if (initialDataRef.current) {
      const hasChanges =
        JSON.stringify(settings) !== JSON.stringify(initialDataRef.current);
      setHasUnsavedChanges(hasChanges);
    }
  }, [settings]);

  useEffect(() => {
    if (!contextLoading && cachedSettings) {
      if (cachedSettings.autoreply) {
        setSettings(cachedSettings.autoreply);
        initialDataRef.current = cachedSettings.autoreply;
      }
      setIsLoading(false);
    }
  }, [contextLoading, cachedSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/server/${serverId}/autoreply`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(settings),
        }
      );

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        initialDataRef.current = { ...settings };
        setHasUnsavedChanges(false);
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const addRule = () => {
    if (!newRule.keyword.trim() || !newRule.reply.trim()) return;

    const rule: Rule = {
      id: Date.now().toString(),
      ...newRule,
    };

    setSettings((prev) => ({
      ...prev,
      rules: [...prev.rules, rule],
    }));

    setNewRule({ keyword: "", reply: "", match: "contains", enabled: true });
    setShowModal(false);
  };

  const toggleRuleEnabled = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  };

  const updateRule = () => {
    if (
      !editingRule ||
      !editingRule.keyword.trim() ||
      !editingRule.reply.trim()
    )
      return;

    setSettings((prev) => ({
      ...prev,
      rules: prev.rules.map((r) => (r.id === editingRule.id ? editingRule : r)),
    }));

    setEditingRule(null);
  };

  const deleteRule = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== id),
    }));
  };

  const filteredRules = settings.rules.filter(
    (r) =>
      r.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reply.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Otomatik Cevap</h1>
        <p className="text-slate-400">
          Belirli kelimelere otomatik yanıt veren kurallar oluşturun.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 bg-surface rounded-xl border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/20">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Otomatik Cevap Sistemi
              </h2>
              <p className="text-sm text-slate-400">
                Sistemi aktif veya pasif yapın
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, enabled: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-surface rounded-xl border border-white/10"
      >
        {!settings.enabled && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
            <MessageCircle className="w-4 h-4" />
            Kuralları düzenlemek için sistemi aktif edin.
          </div>
        )}

        <div
          className={`${
            !settings.enabled ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Kurallar ({settings.rules.length})
            </h2>
            <Button
              size="sm"
              onClick={() => setShowModal(true)}
              disabled={!settings.enabled}
            >
              <Plus className="w-4 h-4 mr-1" />
              Kural Ekle
            </Button>
          </div>

          {settings.rules.length > 0 && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kural ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
              />
            </div>
          )}

          {filteredRules.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Henüz kural eklenmemiş</p>
              <p className="text-sm text-slate-500">
                Yeni bir kural ekleyerek başlayın
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRules.map((rule) => (
                <motion.div
                  key={rule.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    rule.enabled
                      ? "bg-white/5 border-white/5"
                      : "bg-white/[0.02] border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => toggleRuleEnabled(rule.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-sm font-medium ${
                              rule.enabled ? "text-white" : "text-slate-400"
                            }`}
                          >
                            {rule.keyword}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              rule.match === "exact"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {rule.match === "exact" ? "Tam eşleşme" : "İçerir"}
                          </span>
                          {!rule.enabled && (
                            <span className="px-2 py-0.5 rounded text-xs bg-slate-500/20 text-slate-400">
                              Pasif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 truncate">
                          {rule.reply}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <Button
              onClick={saveSettings}
              disabled={saving || !settings.enabled}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : saved ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-white/10 rounded-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Yeni Kural Ekle
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Anahtar Kelime
                  </label>
                  <input
                    type="text"
                    value={newRule.keyword}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        keyword: e.target.value,
                      }))
                    }
                    placeholder="Örn: sa, selam"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Eşleşme Türü
                  </label>
                  <select
                    value={newRule.match}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        match: e.target.value as "contains" | "exact",
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                  >
                    <option value="contains">İçerir</option>
                    <option value="exact">Tam Eşleşme</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Yanıt
                  </label>
                  <textarea
                    value={newRule.reply}
                    onChange={(e) =>
                      setNewRule((prev) => ({ ...prev, reply: e.target.value }))
                    }
                    placeholder="Örn: Aleyküm selam!"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button
                  onClick={addRule}
                  disabled={!newRule.keyword.trim() || !newRule.reply.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ekle
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingRule(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-white/10 rounded-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Kuralı Düzenle
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Anahtar Kelime
                  </label>
                  <input
                    type="text"
                    value={editingRule.keyword}
                    onChange={(e) =>
                      setEditingRule((prev) =>
                        prev ? { ...prev, keyword: e.target.value } : null
                      )
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Eşleşme Türü
                  </label>
                  <select
                    value={editingRule.match}
                    onChange={(e) =>
                      setEditingRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              match: e.target.value as "contains" | "exact",
                            }
                          : null
                      )
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                  >
                    <option value="contains">İçerir</option>
                    <option value="exact">Tam Eşleşme</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Yanıt
                  </label>
                  <textarea
                    value={editingRule.reply}
                    onChange={(e) =>
                      setEditingRule((prev) =>
                        prev ? { ...prev, reply: e.target.value } : null
                      )
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setEditingRule(null)}
                >
                  İptal
                </Button>
                <Button onClick={updateRule}>
                  <Save className="w-4 h-4 mr-1" />
                  Kaydet
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUnsavedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ x: { duration: 0.5 } }}
              className="bg-background border border-white/10 rounded-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Kaydedilmemiş Değişiklikler
                  </h3>
                  <p className="text-sm text-slate-400">
                    Değişiklikleriniz kaybolacak!
                  </p>
                </div>
              </div>

              <p className="text-slate-300 mb-6">
                Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak
                istediğinizden emin misiniz?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    blocker.reset?.();
                  }}
                >
                  İptal
                </Button>
                <button
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    pendingNavigationRef.current?.();
                  }}
                >
                  Ayrıl
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
