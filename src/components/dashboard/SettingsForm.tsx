"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HoverButton } from "@/components/ui/hover-button";
import { User, Key, Zap, Check, X, Bot } from "lucide-react";

export function SettingsForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; error?: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setHasApiKey(data.hasApiKey || false);
        setMaskedKey(data.maskedKey || "");
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);

    const body: Record<string, string> = { name };
    if (apiKey.trim()) body.apiKey = apiKey.trim();

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (apiKey.trim()) {
      setHasApiKey(true);
      setMaskedKey(`${apiKey.slice(0, 14)}${"•".repeat(20)}${apiKey.slice(-4)}`);
      setApiKey("");
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    await update({ name });
  }

  async function handleTestKey() {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestResult({ valid: false, error: "Introdu cheia înainte de a o testa." });
      return;
    }
    setTesting(true);
    setTestResult(null);

    const res = await fetch("/api/settings/test-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: keyToTest }),
    });
    const data = await res.json();
    setTestResult(data);
    setTesting(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-geist text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">Gestionează contul și cheia API Anthropic</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-geist font-semibold text-white flex items-center gap-2">
            <User size={14} strokeWidth={1.8} /> Profil
          </h2>

          <div>
            <label className="block text-sm text-[#a1a1aa] mb-1.5">Nume complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-sm text-[#a1a1aa] mb-1.5">Email</label>
            <input
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl text-[#71717a] text-sm"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>
        </motion.div>

        {/* API Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-geist font-semibold text-white flex items-center gap-2">
              <Key size={14} strokeWidth={1.8} /> Anthropic API Key
            </h2>
            {hasApiKey && (
              <span className="flex items-center gap-1.5 text-xs text-[#22c55e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
                Cheie configurată
              </span>
            )}
          </div>

          {/* Instructions */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}
          >
            <p className="text-xs font-semibold text-[#a855f7] mb-2">Cum obții cheia:</p>
            <ol className="space-y-1">
              {[
                "Creează cont pe console.anthropic.com",
                "Mergi la secțiunea API Keys",
                "Click Create Key și dă-i un nume",
                "Copiază cheia și lipește-o mai jos",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#a1a1aa]">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(168,85,247,0.2)", color: "#a855f7" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#a855f7] hover:text-white transition-colors mt-1"
            >
              Deschide console.anthropic.com →
            </a>
          </div>

          {/* Current key (masked) */}
          {hasApiKey && maskedKey && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
            >
              <Check size={14} color="#22c55e" strokeWidth={2.5} />
              <span className="text-[#a1a1aa] text-sm font-mono">{maskedKey}</span>
            </div>
          )}

          {/* New key input */}
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-1.5">
              {hasApiKey ? "Schimbă cheia API" : "Anthropic API Key"}
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
                className="w-full px-4 py-3 pr-16 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all font-mono"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="sk-ant-api03-..."
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71717a] hover:text-white transition-colors px-1"
              >
                {showKey ? "Ascunde" : "Arată"}
              </button>
            </div>
          </div>

          {/* Test key button */}
          <div className="flex items-center gap-3">
            <HoverButton
              type="button"
              onClick={handleTestKey}
              disabled={testing || !apiKey.trim()}
              className="px-4 py-2 text-sm font-medium text-[#a855f7]"
              style={{ "--circle-start": "#a855f7", "--circle-end": "#7c3aed" } as React.CSSProperties}
            >
              {testing ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-[#a855f7] border-t-transparent rounded-full animate-spin" />
                  Se testează...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Zap size={12} strokeWidth={2} />Testează cheia</span>

              )}
            </HoverButton>

            <AnimatePresence>
              {testResult && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm"
                >
                  {testResult.valid ? (
                    <>
                      <Check size={14} color="#22c55e" strokeWidth={2.5} />
                      <span className="text-[#22c55e]">Cheie validă!</span>
                    </>
                  ) : (
                    <>
                      <X size={14} color="#f87171" strokeWidth={2.5} />
                      <span className="text-red-400">{testResult.error}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Models info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-geist font-semibold text-white flex items-center gap-2">
            <Bot size={14} strokeWidth={1.8} /> Modele disponibile
          </h2>
          <div className="space-y-2">
            {[
              { name: "Claude Haiku", id: "claude-haiku-4-5-20251001", desc: "Rapid & eficient pentru taskuri simple", cost: "$0.25 / 1M tokens" },
              { name: "Claude Sonnet", id: "claude-sonnet-4-5", desc: "Echilibrat pentru taskuri profesionale", cost: "$3 / 1M tokens" },
              { name: "Claude Opus", id: "claude-opus-4-5", desc: "Cel mai puternic pentru raționament complex", cost: "$15 / 1M tokens" },
            ].map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div>
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-[#71717a]">{m.desc}</p>
                </div>
                <span className="text-xs text-[#a855f7] font-mono">{m.cost}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <HoverButton
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-violet-600 text-white font-semibold text-sm flex items-center gap-2"
        >
          {saved ? <><Check size={13} strokeWidth={2.5} style={{ marginRight: 5 }} />Salvat!</> : saving ? "Se salvează..." : "Salvează modificările"}
        </HoverButton>
      </form>
    </div>
  );
}
