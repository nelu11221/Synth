"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AlertTriangle, MessageSquare, Globe, Send } from "lucide-react";

/* ── Types ── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: string;
  agentEmoji?: string;
  agentDomain?: string;
  createdAt: string | Date;
}

interface TypingAgent {
  agentId: string;
  agentName: string;
  agentEmoji: string;
}

/* ── Sub-components ── */
function NoApiKeyBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 flex-shrink-0"
      style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}
    >
      <AlertTriangle size={15} color="#fbbf24" strokeWidth={1.8} />
      <p style={{ fontSize: 13, color: "#fbbf24", flex: 1, fontFamily: "'Outfit',sans-serif" }}>
        Adaugă Anthropic API Key în Settings pentru a activa agenții.
      </p>
      <Link
        href="/dashboard/settings"
        style={{
          fontSize: 12, padding: "6px 12px", borderRadius: 8, fontWeight: 600,
          background: "rgba(245,158,11,0.15)", color: "#fbbf24",
          textDecoration: "none", flexShrink: 0, fontFamily: "'Outfit',sans-serif",
        }}
      >
        Configurează →
      </Link>
    </motion.div>
  );
}

function TypingIndicator({ agent }: { agent: TypingAgent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-3"
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))",
        border: "1px solid rgba(124,58,237,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>
        {agent.agentEmoji}
      </div>
      <div>
        <p style={{ fontSize: 11, color: "#a855f7", fontWeight: 600, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>
          {agent.agentName}
        </p>
        <div style={{
          padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AgentMessage({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-end gap-3"
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))",
        border: "1px solid rgba(124,58,237,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>
        {msg.agentEmoji || "🤖"}
      </div>

      <div style={{ maxWidth: "60%", minWidth: 0 }}>
        <div className="flex items-baseline gap-2 mb-1">
          <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
            {msg.agentName}
          </span>
          {msg.agentDomain && (
            <span style={{ fontSize: 10, color: "#52525b", fontFamily: "'Outfit',sans-serif" }}>
              {msg.agentDomain}
            </span>
          )}
        </div>
        <div style={{
          padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
          fontSize: 14, color: "#e4e4e7", lineHeight: 1.6,
          fontFamily: "'Outfit',sans-serif", whiteSpace: "pre-wrap",
        }}>
          {msg.content}
        </div>
        <span style={{ fontSize: 11, color: "#3f3f46", marginTop: 4, display: "block", fontFamily: "'Outfit',sans-serif" }}>
          {new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

function UserMessage({ msg, initials }: { msg: ChatMessage; initials: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-end justify-end gap-3"
    >
      <div style={{ maxWidth: "60%", minWidth: 0 }}>
        <div style={{
          padding: "10px 14px", borderRadius: "14px 14px 4px 14px",
          background: "rgba(124,58,237,0.28)", border: "1px solid rgba(124,58,237,0.35)",
          fontSize: 14, color: "#ede9fe", lineHeight: 1.6,
          fontFamily: "'Outfit',sans-serif", whiteSpace: "pre-wrap",
        }}>
          {msg.content}
        </div>
        <span style={{ fontSize: 11, color: "#3f3f46", marginTop: 4, display: "block", textAlign: "right", fontFamily: "'Outfit',sans-serif" }}>
          {new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color: "#fff",
        boxShadow: "0 0 8px rgba(124,58,237,0.3)",
      }}>
        {initials}
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */
export function TeamChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingAgents, setTypingAgents] = useState<TypingAgent[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [noApiKey, setNoApiKey] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const userInitials = session?.user?.name?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingAgents]);

  /* Clear pending reveal timeouts on unmount */
  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    /* Optimistically add user message */
    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (res.status === 402 || data.error === "NO_API_KEY") {
        setNoApiKey(true);
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        setSending(false);
        return;
      }

      if (!res.ok || !data.responses) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant" as const,
            content: data.error || "Eroare la procesarea mesajului.",
            agentName: "System",
            agentEmoji: "⚠️",
            createdAt: new Date(),
          },
        ]);
        setSending(false);
        return;
      }

      setNoApiKey(false);

      /* Show all typing indicators immediately */
      const responses: Array<{
        agentId: string; agentName: string; agentEmoji: string;
        agentDomain: string; message: ChatMessage; delay: number;
      }> = data.responses;

      setTypingAgents(
        responses.map((r) => ({
          agentId: r.agentId,
          agentName: r.agentName,
          agentEmoji: r.agentEmoji,
        }))
      );

      /* Reveal each message after its delay, removing its typing indicator */
      responses.forEach((r) => {
        const t = setTimeout(() => {
          setTypingAgents((prev) => prev.filter((a) => a.agentId !== r.agentId));
          setMessages((prev) => [
            ...prev,
            { ...r.message, agentDomain: r.agentDomain } as ChatMessage,
          ]);
        }, r.delay + 600); /* +600ms so typing shows briefly even for delay=0 */
        timeoutsRef.current.push(t);
      });

      /* Re-enable send after last message revealed */
      const lastDelay = Math.max(...responses.map((r) => r.delay), 0) + 700;
      const t = setTimeout(() => setSending(false), lastDelay);
      timeoutsRef.current.push(t);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant" as const,
          content: "Eroare de rețea. Încearcă din nou.",
          agentName: "System",
          agentEmoji: "⚠️",
          createdAt: new Date(),
        },
      ]);
      setSending(false);
    }
  }, [input, sending]);

  const isEmpty = messages.length === 0 && typingAgents.length === 0;

  return (
    <div className="flex flex-col max-w-4xl mx-auto" style={{ height: "calc(100vh - 7rem)" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 flex items-center justify-between px-5 py-4 rounded-2xl mb-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div>
          <h1 className="flex items-center gap-2" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 16, margin: 0 }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={12} color="#a855f7" strokeWidth={1.8} />
            </div>
            Team Chat
          </h1>
          <p style={{ fontSize: 12, color: "#52525b", marginTop: 4, fontFamily: "'Outfit',sans-serif" }}>
            Orchestratorul AI rutează fiecare mesaj către agenții potriviți
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: 12, color: "#22c55e", fontFamily: "'Outfit',sans-serif" }}>Orchestrator activ</span>
        </div>
      </motion.div>

      {/* API Key banner */}
      {noApiKey && <NoApiKeyBanner />}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ minHeight: 0 }}>

        {/* Empty state */}
        {isEmpty && !noApiKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Globe size={28} color="#7c3aed" strokeWidth={1.3} />
            </div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 8 }}>
              Vorbește cu întreaga echipă
            </h3>
            <p style={{ color: "#71717a", fontSize: 14, fontFamily: "'Outfit',sans-serif", maxWidth: 300 }}>
              Salută-ți agenții sau adresează o întrebare. Orchestratorul decide cine răspunde.
            </p>
          </motion.div>
        )}

        {/* Message list */}
        <AnimatePresence>
          {messages.map((msg) =>
            msg.role === "user" ? (
              <UserMessage key={msg.id} msg={msg} initials={userInitials} />
            ) : (
              <AgentMessage key={msg.id} msg={msg} />
            )
          )}
        </AnimatePresence>

        {/* Typing indicators */}
        <AnimatePresence>
          {typingAgents.map((agent) => (
            <TypingIndicator key={agent.agentId} agent={agent} />
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex-shrink-0 flex items-end gap-3 p-3 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
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
          style={{
            flex: 1, background: "transparent", color: "#fff", fontSize: 14,
            resize: "none", outline: "none", fontFamily: "'Outfit',sans-serif",
            lineHeight: 1.5, padding: "4px 0", maxHeight: 120,
          }}
          placeholder={noApiKey ? "Setează API Key în Settings..." : "Scrie un mesaj echipei... (Enter pentru trimite)"}
          disabled={noApiKey}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending || noApiKey}
          className="flex items-center justify-center gap-2 transition-all duration-200 flex-shrink-0"
          style={{
            padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer",
            background: !input.trim() || sending || noApiKey
              ? "rgba(124,58,237,0.2)"
              : "linear-gradient(135deg,#7c3aed,#a855f7)",
            color: !input.trim() || sending || noApiKey ? "#52525b" : "#fff",
            fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
            boxShadow: !input.trim() || sending || noApiKey ? "none" : "0 4px 12px rgba(124,58,237,0.3)",
          }}
        >
          <Send size={14} strokeWidth={2} />
          {sending ? "..." : "Trimite"}
        </button>
      </motion.div>
    </div>
  );
}
