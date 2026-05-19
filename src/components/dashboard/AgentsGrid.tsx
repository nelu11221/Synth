"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bot, Trash2, Plus, MessageSquare } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  domain: string;
  model: string;
  isActive: boolean;
  skills: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MODEL_LABEL: Record<string, { label: string; color: string }> = {
  "claude-haiku-4-5-20251001": { label: "Haiku",  color: "#22c55e" },
  "claude-haiku-4-5":          { label: "Haiku",  color: "#22c55e" },
  "claude-sonnet-4-5":         { label: "Sonnet", color: "#a855f7" },
  "claude-opus-4-5":           { label: "Opus",   color: "#f97316" },
  "claude-sonnet-4-6":         { label: "Sonnet", color: "#a855f7" },
};

export function AgentsGrid({ initialAgents }: { initialAgents: Agent[] }) {
  const [agents, setAgents] = useState(initialAgents);

  async function deleteAgent(id: string) {
    if (!confirm("Delete this agent?")) return;
    await fetch(`/api/agents/${id}`, { method: "DELETE" });
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.04em", margin: 0 }}>
            Your Agents
          </h1>
          <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, fontFamily: "'Outfit',sans-serif" }}>
            {agents.length} agent{agents.length !== 1 ? "s" : ""} in your team
          </p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="flex items-center gap-2 transition-all duration-200"
          style={{
            padding: "10px 18px", borderRadius: 12,
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            color: "#fff", fontSize: 13, fontWeight: 600,
            fontFamily: "'Outfit',sans-serif", textDecoration: "none",
            boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <Plus size={14} strokeWidth={2.5} /> New Agent
        </Link>
      </motion.div>

      {agents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-center"
          style={{
            padding: "64px 32px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bot size={28} color="#7c3aed" strokeWidth={1.3} />
          </div>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            No agents yet
          </h3>
          <p style={{ color: "#71717a", fontSize: 14, fontFamily: "'Outfit',sans-serif", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px" }}>
            Create your first AI agent and start automating your workflow.
          </p>
          <Link
            href="/dashboard/agents/new"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 12,
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "#fff", fontSize: 14, fontWeight: 600,
              fontFamily: "'Outfit',sans-serif", textDecoration: "none",
              boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
            }}
          >
            <Plus size={15} strokeWidth={2.5} /> Create your first agent
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {agents.map((agent, i) => {
              const model = MODEL_LABEL[agent.model];
              const skills = JSON.parse(agent.skills || "[]") as string[];

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20, padding: 20,
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.25)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  {/* Subtle glow on hover */}
                  <div style={{
                    position: "absolute", top: -30, right: -30, width: 100, height: 100,
                    background: `radial-gradient(circle, ${agent.color}18 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />

                  {/* Status */}
                  <div className="flex items-center gap-1.5" style={{ position: "absolute", top: 16, right: 16 }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: agent.isActive ? "#22c55e" : "#3f3f46",
                      boxShadow: agent.isActive ? "0 0 5px #22c55e" : "none",
                    }} />
                    <span style={{ fontSize: 11, color: agent.isActive ? "#22c55e" : "#3f3f46", fontFamily: "'Outfit',sans-serif" }}>
                      {agent.isActive ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{
                      width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                      background: `${agent.color}18`, border: `1px solid ${agent.color}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      {agent.emoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#f4f4f5", fontSize: 14, margin: 0 }}>
                        {agent.name}
                      </h3>
                      <p style={{ fontSize: 12, color: "#71717a", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>
                        {agent.domain}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {model && (
                      <span style={{
                        fontSize: 10, padding: "3px 9px", borderRadius: 999, fontWeight: 600,
                        background: `${model.color}18`, border: `1px solid ${model.color}35`,
                        color: model.color, fontFamily: "'Outfit',sans-serif",
                      }}>
                        {model.label}
                      </span>
                    )}
                    {skills.slice(0, 2).map((skill: string) => (
                      <span key={skill} style={{
                        fontSize: 10, padding: "3px 9px", borderRadius: 999, fontWeight: 500,
                        background: "rgba(255,255,255,0.05)", color: "#71717a",
                        fontFamily: "'Outfit',sans-serif",
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/agents/${agent.id}`}
                      className="flex items-center justify-center gap-2 flex-1 transition-all duration-200"
                      style={{
                        padding: "9px 14px", borderRadius: 10,
                        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                        color: "#fff", fontSize: 12, fontWeight: 600,
                        fontFamily: "'Outfit',sans-serif", textDecoration: "none",
                        boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                      <MessageSquare size={12} strokeWidth={2} /> Chat
                    </Link>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      title="Delete agent"
                      className="transition-all duration-200"
                      style={{
                        padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                        background: "rgba(239,68,68,0.08)", color: "#ef4444",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
