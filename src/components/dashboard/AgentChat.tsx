"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HoverButton } from "@/components/ui/hover-button";
import { AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: Date | string;
}

interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  domain: string;
  model: string;
  isActive: boolean;
}

const modelLabel: Record<string, string> = {
  "claude-haiku-4-5-20251001": "Haiku",
  "claude-haiku-4-5": "Haiku",
  "claude-sonnet-4-5": "Sonnet",
  "claude-opus-4-5": "Opus",
};

function NoApiKeyBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
      style={{
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.25)",
      }}
    >
      <AlertTriangle size={16} color="#fbbf24" strokeWidth={1.8} className="flex-shrink-0" />
      <p className="text-sm text-[#fbbf24] flex-1">
        Adaugă Anthropic API Key în Settings pentru a activa agenții.
      </p>
      <Link
        href="/dashboard/settings"
        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90 flex-shrink-0"
        style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24" }}
      >
        Configurează →
      </Link>
    </motion.div>
  );
}

export function AgentChat({
  agent,
  initialMessages,
  conversationId: initialConvId,
}: {
  agent: Agent;
  initialMessages: Message[];
  conversationId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(initialConvId);
  const [noApiKey, setNoApiKey] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content: text, createdAt: new Date() },
    ]);

    try {
      const res = await fetch(`/api/chat/${agent.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });

      const data = await res.json();

      if (res.status === 402 || data.error === "NO_API_KEY") {
        setNoApiKey(true);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      } else if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: `err-${Date.now()}`, role: "assistant", content: data.error || "Something went wrong.", createdAt: new Date() },
        ]);
      } else {
        setNoApiKey(false);
        if (!conversationId) setConversationId(data.conversationId);
        setMessages((prev) => [...prev, data.message]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: "Eroare de rețea. Încearcă din nou.", createdAt: new Date() },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl px-5 py-4 mb-4 flex items-center gap-4"
      >
        <Link href="/dashboard/agents" className="text-[#71717a] hover:text-white transition-colors text-sm">
          ← Agents
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${agent.color}22`, border: `1px solid ${agent.color}44` }}
        >
          {agent.emoji}
        </div>
        <div className="flex-1">
          <p className="font-geist font-semibold text-white">{agent.name}</p>
          <p className="text-xs text-[#a1a1aa]">{agent.domain} • {modelLabel[agent.model] || agent.model}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span className="text-xs text-[#22c55e]">Online</span>
        </div>
      </motion.div>

      {/* No API Key Banner */}
      {noApiKey && <NoApiKeyBanner />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && !noApiKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4"
              style={{ background: `${agent.color}22`, border: `1px solid ${agent.color}44` }}
            >
              {agent.emoji}
            </div>
            <h3 className="font-geist font-semibold text-white text-lg mb-2">
              Începe conversația cu {agent.name}
            </h3>
            <p className="text-[#a1a1aa] text-sm max-w-xs">
              Sunt specializat în {agent.domain}. Întreabă-mă orice!
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 self-end"
                  style={{ background: `${agent.color}22` }}
                >
                  {agent.emoji}
                </div>
              )}

              <div className={`max-w-lg ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? { background: "rgba(124,58,237,0.25)", color: "white", borderBottomRightRadius: "4px" }
                      : { background: "rgba(255,255,255,0.05)", color: "#e4e4e7", borderBottomLeftRadius: "4px" }
                  }
                >
                  {msg.content}
                </div>
                <span className="text-xs text-[#71717a]">
                  {new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-end">
                  U
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-3"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: `${agent.color}22` }}>
              {agent.emoji}
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5" style={{ borderBottomLeftRadius: "4px" }}>
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: agent.color }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 glass rounded-2xl p-3 flex items-end gap-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-[#71717a] max-h-32 py-1"
          placeholder={noApiKey ? "Setează API Key în Settings..." : `Mesaj pentru ${agent.name}...`}
          disabled={noApiKey}
          style={{ lineHeight: "1.5" }}
        />
        <HoverButton
          onClick={sendMessage}
          disabled={!input.trim() || loading || noApiKey}
          className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold flex-shrink-0"
        >
          Trimite →
        </HoverButton>
      </motion.div>
    </div>
  );
}
