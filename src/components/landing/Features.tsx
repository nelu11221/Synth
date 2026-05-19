"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";

const ease = [.22, 1, .36, 1] as const;

const BADGE_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  FREE:          { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  color: "#22c55e" },
  "ON DEMAND":   { bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", color: "#f97316" },
  "COMING SOON": { bg: "rgba(100,116,139,0.1)",border: "rgba(100,116,139,0.2)", color: "#94a3b8" },
};

function Badge({ label }: { label: string }) {
  const s = BADGE_STYLES[label] ?? BADGE_STYLES["FREE"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 9px", borderRadius: 999,
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: 10, fontWeight: 700, color: s.color,
      letterSpacing: ".07em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

type Feature = { text: string; badge?: string };

const CARDS: Array<{
  title: string; subtitle: string; badge: string;
  accent: string; accentRgb: string; features: Feature[];
}> = [
  {
    title: "The Platform",
    subtitle: "Everything you need to build your AI team",
    badge: "FREE",
    accent: "#22c55e",
    accentRgb: "34,197,94",
    features: [
      { text: "Custom agents with unique personas & instructions" },
      { text: "Choose any Claude model per agent (Haiku / Sonnet / Opus)" },
      { text: "Team chat — all agents in one conversation" },
      { text: "Kanban task board with agent assignment" },
      { text: "Full conversation history & export" },
    ],
  },
  {
    title: "Intelligence Layer",
    subtitle: "Extend agents with real-world capabilities",
    badge: "ON DEMAND",
    accent: "#f97316",
    accentRgb: "249,115,22",
    features: [
      { text: "Persistent agent memory across sessions",  badge: "ON DEMAND" },
      { text: "Web search & live data access",            badge: "ON DEMAND" },
      { text: "Code interpreter & file analysis",         badge: "ON DEMAND" },
      { text: "Custom tool & API integrations",           badge: "COMING SOON" },
      { text: "Voice interface for agents",               badge: "COMING SOON" },
    ],
  },
];

export function WhatSynthAdds() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="divider" />
      <section id="features" className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        {/* Background glow */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(124,58,237,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(34,197,94,0.12) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 50% 85%, rgba(168,85,247,0.1) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            style={{ textAlign: "center", marginBottom: 72 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "5px 14px", borderRadius: 999, marginBottom: 24,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1l1.18 2.39L9 4.09 6.92 6.12 7.36 9 5 7.76 2.64 9l.44-2.88L1 4.09l2.82-.7L5 1z"
                  fill="#a855f7" />
              </svg>
              <span style={{
                fontSize: 11, color: "#c4b5fd", fontWeight: 700,
                letterSpacing: ".08em", textTransform: "uppercase",
              }}>
                What Synth adds
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(38px, 4.5vw, 62px)",
              fontWeight: 800,
              letterSpacing: "-.055em",
              lineHeight: 1.05,
              color: "#fff",
              margin: 0,
              maxWidth: 700,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Built for teams that move fast
            </h2>
          </motion.div>

          {/* 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
            {CARDS.map((card, ci) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: ci * 0.14, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              >
                <GlassCard style={{ borderRadius: 24, padding: "36px 36px 40px", position: "relative" }}>
                {/* Top accent glow */}
                <div aria-hidden style={{
                  position: "absolute", top: -60, left: "50%",
                  transform: "translateX(-50%)",
                  width: 300, height: 120,
                  background: `radial-gradient(ellipse, rgba(${card.accentRgb},0.12) 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                {/* Card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <h3 style={{
                      fontSize: 22, fontWeight: 800, color: "#fff",
                      letterSpacing: "-.04em", margin: "0 0 6px",
                    }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                      {card.subtitle}
                    </p>
                  </div>
                  <Badge label={card.badge} />
                </div>

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)",
                  marginBottom: 24,
                }} />

                {/* Feature list */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {card.features.map(f => (
                    <li key={f.text} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          background: `rgba(${card.accentRgb},0.12)`,
                          border: `1px solid rgba(${card.accentRgb},0.25)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.2 2.2L8 3" stroke={card.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.45 }}>{f.text}</span>
                      </div>
                      {f.badge && <Badge label={f.badge} />}
                    </li>
                  ))}
                </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
