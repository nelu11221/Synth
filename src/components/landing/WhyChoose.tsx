"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Bot, BarChart2, PenLine, Zap, Infinity, Brain, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const ease = [.22, 1, .36, 1] as const;

/* ── Typewriter for "Define any domain" card ── */
const EXAMPLES = [
  "Customer support specialist",
  "SEO & content optimizer",
  "Code review assistant",
  "Data analysis expert",
  "Email management bot",
  "Research synthesizer",
];

function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = EXAMPLES[idx];
    const delay = deleting ? 28 : chars === target.length ? 1600 : 52;

    const timer = setTimeout(() => {
      if (!deleting && chars === target.length) {
        setDeleting(true);
      } else if (deleting && chars === 0) {
        setDeleting(false);
        setIdx(i => (i + 1) % EXAMPLES.length);
      } else {
        setChars(c => c + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [chars, deleting, idx]);

  return (
    <span style={{ color: "#c4b5fd" }}>
      {EXAMPLES[idx].slice(0, chars)}
      <span style={{
        display: "inline-block", width: 2, height: "1em",
        background: "#a855f7", marginLeft: 2, verticalAlign: "text-bottom",
        animation: "pulse-glow 0.9s ease-in-out infinite",
      }} />
    </span>
  );
}

/* ── Model selector ── */
const MODELS = [
  { label: "Haiku",  color: "#22c55e", desc: "Fast & lean"    },
  { label: "Sonnet", color: "#a855f7", desc: "Balanced"       },
  { label: "Opus",   color: "#f97316", desc: "Max reasoning"  },
];

function ModelToggle() {
  const [active, setActive] = useState("Sonnet");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {MODELS.map(m => {
        const on = active === m.label;
        return (
          <button
            key={m.label}
            onClick={() => setActive(m.label)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 12,
              background: on ? `rgba(${hexRgb(m.color)},0.12)` : "rgba(255,255,255,0.03)",
              outline: `1px solid ${on ? m.color + "4d" : "rgba(255,255,255,0.07)"}`,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(.32,.72,0,1)",
              textAlign: "left",
            } as React.CSSProperties}
          >
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: on ? m.color : "#3f3f46",
              boxShadow: on ? `0 0 6px ${m.color}` : "none",
              flexShrink: 0,
              transition: "background 0.2s, box-shadow 0.2s",
            }} />
            <span style={{
              fontSize: 13, fontWeight: on ? 700 : 500,
              color: on ? "#f4f4f5" : "#71717a",
            }}>
              Claude {m.label}
            </span>
            <span style={{
              fontSize: 11, color: on ? m.color : "#3f3f46",
              marginLeft: "auto", fontWeight: 500,
            }}>
              {m.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Mini chat ── */
const CHAT_MSGS = [
  { role: "user",      text: "Analyze our Q1 conversion data" },
  { role: "assistant", name: "Analytics Bot", text: "Email CVR: 4.2% — up 45% vs Q4. Organic search at 3.1%. Top drop-off: checkout step 3." },
  { role: "user",      text: "Suggest a fix for step 3" },
  { role: "assistant", name: "Analytics Bot", text: "Simplify the form to 2 fields. A/B tests show -30% abandonment with fewer fields." },
];

function MiniChat() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: "rgba(124,58,237,0.2)",
          border: "1px solid rgba(124,58,237,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BarChart2 size={12} color="#a855f7" strokeWidth={2} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#f4f4f5" }}>Analytics Bot</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 10, color: "#22c55e" }}>Online</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "flex-end" }}>
        {CHAT_MSGS.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "85%",
              padding: "8px 12px",
              borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              background: m.role === "user" ? "rgba(124,58,237,0.28)" : "rgba(255,255,255,0.05)",
              fontSize: 12, color: m.role === "user" ? "#ddd6fe" : "#d4d4d8",
              lineHeight: 1.5,
            }}>
              {m.role === "assistant" && (
                <div style={{ fontSize: 10, color: "#a855f7", fontWeight: 700, marginBottom: 3 }}>{m.name}</div>
              )}
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/* ── Card wrapper ── */
function BentoCard({
  children, style, className, delay = 0, inView,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  delay?: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
    >
      <GlassCard style={{ borderRadius: 16, padding: "20px 24px", position: "relative", height: "100%", boxSizing: "border-box", ...style }}>
        {children}
      </GlassCard>
    </motion.div>
  );
}

export function AgentNetwork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="divider" />
      <section id="agents" className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        {/* Ambient */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 55% at 75% 45%, rgba(124,58,237,0.2) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 25% 65%, rgba(168,85,247,0.15) 0%, transparent 70%), radial-gradient(ellipse 30% 30% at 60% 85%, rgba(236,72,153,0.1) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
          {/* ── Editorial Split layout — 40/60 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]" style={{ gap: 48, alignItems: "start" }}>

            {/* LEFT — Headline */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -28 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease }}
              style={{}}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "5px 14px", borderRadius: 999, marginBottom: 28,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3" fill="#a855f7" />
                </svg>
                <span style={{
                  fontSize: 11, color: "#c4b5fd", fontWeight: 700,
                  letterSpacing: ".08em", textTransform: "uppercase",
                }}>
                  Your agent network
                </span>
              </div>

              <h2 style={{
                fontSize: "clamp(42px, 5vw, 70px)",
                fontWeight: 900, letterSpacing: "-.06em", lineHeight: 1.0,
                color: "#f4f4f5", margin: "0 0 24px",
              }}>
                Your agents.<br />
                <span style={{ color: "#3f3f46" }}>Your rules.</span>
              </h2>

              <p style={{
                fontSize: 16, color: "#71717a", lineHeight: 1.75,
                maxWidth: "42ch", margin: "0 0 36px",
              }}>
                Define any specialist. Any domain. Any personality.
                Synth agents have real memory, real expertise, and collaborate without hand-holding.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { Icon: Bot,      text: "Custom persona per agent" },
                  { Icon: Zap,      text: "Any Claude model, per task" },
                  { Icon: BarChart2,text: "Shared memory & context" },
                ].map(({ Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={13} color="#a855f7" strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 14, color: "#a1a1aa" }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Vertical stack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >

              {/* Card 1 — Define any domain */}
              <div style={{
                minHeight: 180, padding: 24,
                borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}>
                <div style={{ fontSize: 11, color: "#52525b", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>
                  Define any domain
                </div>

                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  borderRadius: 10, padding: "11px 16px",
                  marginBottom: 14,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <PenLine size={13} color="#52525b" strokeWidth={1.8} />
                  <span style={{ fontSize: 14, color: "#71717a" }}>I need a </span>
                  <Typewriter />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Marketing", "Engineering", "Support", "Finance", "Legal", "Sales"].map(d => (
                    <span key={d} style={{
                      padding: "4px 10px", borderRadius: 999,
                      background: "rgba(124,58,237,0.08)",
                      border: "1px solid rgba(124,58,237,0.18)",
                      fontSize: 11.5, color: "#c4b5fd", fontWeight: 500,
                    }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 2 — Choose your AI brain */}
              <div style={{
                minHeight: 160, padding: 24,
                borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}>
                <div style={{ fontSize: 11, color: "#52525b", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>
                  Choose your AI brain
                </div>
                <ModelToggle />
              </div>

              {/* Row — ∞ Possibilities + Live collaboration — 50/50 */}
              <div className="flex flex-col sm:flex-row" style={{ gap: 12 }}>

                {/* Possibilities — 3-column icon grid */}
                <div style={{
                  flex: 1, minHeight: 120,
                  borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 16, padding: 24,
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="2">
                        <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/>
                        <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>
                      </svg>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>Any domain</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>Any model</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>Any team</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: 0 }}>
                    No limits on what your agents can do
                  </p>
                </div>

                {/* Live collaboration — capped with gradient fade */}
                <div style={{
                  flex: 1, minHeight: 120, padding: 20,
                  borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <div style={{ fontSize: 11, color: "#52525b", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>
                    Live collaboration
                  </div>

                  <div style={{ maxHeight: 180, overflow: "hidden" }}>
                    <MiniChat />
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
