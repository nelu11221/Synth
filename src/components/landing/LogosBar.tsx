"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";

const ease = [.22, 1, .36, 1] as const;

const problems = [
  {
    accent: "#f97316",
    accentRgb: "249,115,22",
    tag: "Memory",
    title: "No context between sessions",
    body: "Generic LLMs reset every conversation. They don't know your brand voice, your decisions, or your team's running context.",
  },
  {
    accent: "#ef4444",
    accentRgb: "239,68,68",
    tag: "Expertise",
    title: "One model, all problems",
    body: "A single generalist gives shallow answers to specialist tasks. Your legal, code, and marketing workflows deserve dedicated expertise.",
  },
  {
    accent: "#8b5cf6",
    accentRgb: "139,92,246",
    tag: "Coordination",
    title: "Zero agent collaboration",
    body: "Standalone AI tools work in isolation. No hand-offs, no shared memory, no orchestration. Tasks fall through the cracks.",
  },
];

export function WhyFails() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="divider" />
      <section id="why-fails" className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        {/* Rich background blobs for glass refraction */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 55% at 15% 50%, rgba(249,115,22,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 45% at 85% 30%, rgba(239,68,68,0.14) 0%, transparent 70%), radial-gradient(ellipse 35% 40% at 60% 80%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 16px" }} className="sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 48, alignItems: "center" }}
          >
            {/* Left: Heading */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -28 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "5px 14px", borderRadius: 999, marginBottom: 28,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.22)",
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#ef4444" strokeWidth="1.5"/>
                  <path d="M5 3v2M5 7h.01" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{
                  fontSize: 11, color: "#fca5a5", fontWeight: 700,
                  letterSpacing: ".08em", textTransform: "uppercase",
                }}>
                  The problem
                </span>
              </div>

              <h2 style={{
                fontSize: "clamp(38px, 4.5vw, 62px)",
                fontWeight: 800,
                letterSpacing: "-.055em",
                lineHeight: 1.04,
                color: "#fff",
                margin: "0 0 28px",
              }}>
                Why generic AI<br />
                <span style={{ color: "#3f3f46" }}>fails your team</span>
              </h2>

              <p style={{
                fontSize: 16, color: "#71717a", lineHeight: 1.75,
                maxWidth: "52ch", margin: 0,
              }}>
                Most AI tools hand you one assistant and call it done.
                Real workflows need specialized agents that know your context,
                speak your language, and coordinate like an actual team.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                <span style={{ fontSize: 13, color: "#52525b" }}>Synth addresses all three</span>
              </div>
            </motion.div>

            {/* Right: Problem cards with border-left accent */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {problems.map((p, i) => (
                <motion.div
                  key={p.tag}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.13, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                >
                  <GlassCard style={{
                    borderLeft: `3px solid ${p.accent}`,
                    borderRadius: "0 16px 16px 0",
                    padding: "22px 26px",
                  }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "3px 10px", borderRadius: 999, marginBottom: 10,
                      background: `rgba(${p.accentRgb},0.1)`,
                      border: `1px solid rgba(${p.accentRgb},0.2)`,
                    }}>
                      <span style={{
                        fontSize: 10.5, color: p.accent, fontWeight: 700,
                        letterSpacing: ".08em", textTransform: "uppercase",
                      }}>
                        {p.tag}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: 17, fontWeight: 700, color: "#f4f4f5",
                      letterSpacing: "-.03em", margin: "0 0 8px",
                    }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.65, margin: 0 }}>
                      {p.body}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
