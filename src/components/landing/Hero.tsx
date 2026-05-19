"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MessageSquare, PenLine, Zap, LayoutDashboard,
  Bot, CheckSquare, BarChart2,
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { PillButton } from "@/components/ui/pill-button";

const ease = [.22, 1, .36, 1] as const;

/* ── Stars — client-only (avoid hydration mismatch) ── */
function Stars() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; r: number; o: number }>>([]);

  useEffect(() => {
    setStars(Array.from({ length: 110 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.1 + .25,
      o: Math.random() * .3 + .05,
    })));
  }, []);

  return (
    <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} aria-hidden>
      {stars.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.o} />
      ))}
    </svg>
  );
}

/* ── Floating card shell (desktop only) ── */
const cardBase: React.CSSProperties = {
  background: "rgba(15,10,30,0.82)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(124,58,237,0.25)",
  borderRadius: 16,
  padding: "14px 16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.1)",
  maxWidth: 188,
};

function FloatCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...cardBase, ...style }}>{children}</div>;
}

/* ── Shared Hero copy ── */
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .55, ease }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 18px", borderRadius: 999,
        background: "rgba(124,58,237,0.1)",
        border: "1px solid rgba(124,58,237,0.3)",
      }}
    >
      <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
        <circle cx="3.5" cy="3.5" r="3" fill="#a855f7" />
      </svg>
      <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 500, letterSpacing: ".03em" }}>
        AI Agents Platform
      </span>
      <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
        <circle cx="3.5" cy="3.5" r="3" fill="#a855f7" />
      </svg>
    </motion.div>
  );
}

export function Hero() {
  const router = useRouter();

  return (
    <section style={{ position: "relative", background: "#080808", overflow: "hidden" }}>

      {/* ── Background ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <Stars />
        <div style={{
          position: "absolute",
          top: "5%", left: "50%", transform: "translateX(-50%)",
          width: 900, height: 700,
          background: "radial-gradient(ellipse at 50% 35%, rgba(124,58,237,0.14) 0%, rgba(168,85,247,0.07) 45%, transparent 70%)",
          filter: "blur(60px)", borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: -80, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 350,
          background: "radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.12) 0%, transparent 65%)",
          filter: "blur(50px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 10%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 10%, transparent 100%)",
        }} />
      </div>

      {/* ── Floating cards — desktop only ── */}
      <div className="hidden md:flex" style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: "center",
        zIndex: 30, pointerEvents: "none",
      }}>
        <div style={{ position: "relative", width: "min(100%, 1120px)" }}>

          {/* Left — Team Chat */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease }}
            style={{ position: "absolute", top: "20%", left: -10, pointerEvents: "auto" }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, delay: 0 }}
            >
              <FloatCard>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                  <MessageSquare size={10} color="#71717a" strokeWidth={2} />
                  <span style={{ fontSize: 10, color: "#71717a", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Team Chat</span>
                  <span style={{ fontSize: 10, color: "#3f3f46", marginLeft: "auto" }}>just now</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <PenLine size={14} color="#71717a" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 11.5, color: "#a855f7", fontWeight: 700, marginBottom: 3 }}>Content Writer</div>
                    <div style={{ fontSize: 11, color: "#a1a1aa", lineHeight: 1.5 }}>
                      3 articles published,<br />SEO scores all 90+
                    </div>
                  </div>
                </div>
              </FloatCard>
            </motion.div>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease }}
            style={{ position: "absolute", top: "15%", right: -10, pointerEvents: "auto" }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.0, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            >
              <FloatCard>
                <div style={{ fontSize: 9.5, color: "#71717a", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
                  This Week
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 22px" }}>
                  {[
                    { val: "47",  label: "Tasks done" },
                    { val: "12h", label: "Time saved"  },
                    { val: "3",   label: "Agents"      },
                    { val: "128", label: "Messages"    },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: "-.04em", lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 9.5, color: "#52525b", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </FloatCard>
            </motion.div>
          </motion.div>

          {/* Right — Automation Bot */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease }}
            style={{ position: "absolute", top: "55%", right: -10, pointerEvents: "auto" }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, delay: 2 }}
            >
              <FloatCard style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 200 }}>
                <div style={{
                  width: 33, height: 33, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(124,58,237,.28), rgba(16,185,129,.18))",
                  border: "1px solid rgba(16,185,129,.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Zap size={14} color="#10b981" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>Automation Bot</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
                    <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 500 }}>Online · Claude Haiku</span>
                  </div>
                </div>
              </FloatCard>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE HERO — visible on mobile only
          ══════════════════════════════════════════ */}
      <div
        className="flex md:hidden flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10 relative"
        style={{ zIndex: 10, gap: 20 }}
      >
        {/* Badge */}
        <HeroBadge />

        {/* Headline */}
        <h1 style={{
          fontSize: 48, fontWeight: 800, textAlign: "center",
          lineHeight: 1.1, margin: 0,
        }}>
          <span style={{ color: "#fff" }}>Your AI team.</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Working 24/7.
          </span>
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontSize: 16, color: "rgba(255,255,255,0.6)",
          textAlign: "center", maxWidth: 320,
          lineHeight: 1.6, margin: 0,
        }}>
          Build a team of specialized AI agents tailored to your workflow.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
          <PillButton
            variant="primary"
            onClick={() => router.push("/register")}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Start for free →
          </PillButton>
          <PillButton
            variant="secondary"
            onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
            style={{ width: "100%", justifyContent: "center" }}
          >
            See how it works
          </PillButton>
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 12, width: "100%", maxWidth: 320, marginTop: 20,
        }}>
          {[
            { val: "8+",   label: "Agent types"   },
            { val: "3",    label: "AI Models"      },
            { val: "24/7", label: "Availability"   },
            { val: "∞",    label: "Possibilities"  },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 20, textAlign: "center",
            }}>
              <p style={{ fontSize: 32, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "6px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>{/* end mobile hero */}

      {/* ══════════════════════════════════════════
          DESKTOP HERO — hidden on mobile
          ══════════════════════════════════════════ */}
      <div className="hidden md:block" style={{ position: "relative", zIndex: 10 }}>
        <ContainerScroll
          titleComponent={
            <div style={{
              paddingTop: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}>
              <HeroBadge />

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .7, delay: .1, ease }}
                style={{
                  fontSize: "clamp(40px, 8vw, 92px)",
                  fontWeight: 800,
                  letterSpacing: "-.06em",
                  lineHeight: 1.02,
                  margin: "28px 0 20px",
                  maxWidth: 840,
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#fff" }}>Your AI team.</span>
                <br />
                <span style={{
                  background: "linear-gradient(135deg,#c084fc 0%,#a78bfa 40%,#f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Working 24/7.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .7, delay: .18, ease }}
                style={{
                  fontSize: 18,
                  color: "#a1a1aa",
                  lineHeight: 1.65,
                  maxWidth: 600,
                  margin: "0 auto 36px",
                  textAlign: "center",
                }}
              >
                Build a team of specialized AI agents tailored to your workflow.
                Define their expertise, personality, and AI model — then watch them collaborate.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .7, delay: .26, ease }}
                style={{ display: "flex", gap: 12, justifyContent: "center", position: "relative", zIndex: 50 }}
              >
                <PillButton variant="primary" onClick={() => router.push("/register")}>
                  Start for free →
                </PillButton>
                <PillButton
                  variant="secondary"
                  onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
                >
                  See how it works
                </PillButton>
              </motion.div>
            </div>
          }
        >
          <MiniDashboard />
        </ContainerScroll>
      </div>

    </section>
  );
}

/* ── Mini dashboard UI (inside ContainerScroll's Card) ── */
function MiniDashboard() {
  const NAV = [
    { Icon: LayoutDashboard, label: "Overview",  active: true  },
    { Icon: Bot,             label: "Agents",    active: false },
    { Icon: MessageSquare,   label: "Team Chat", active: false },
    { Icon: CheckSquare,     label: "Tasks",     active: false },
  ];

  const STATS = [
    { val: "3",   label: "Active Agents" },
    { val: "47",  label: "Tasks Done"    },
    { val: "128", label: "Messages"      },
    { val: "12h", label: "Time Saved"    },
  ];

  const AGENT_LIST = [
    { Icon: BarChart2, name: "Analytics Bot"  },
    { Icon: PenLine,   name: "Content Writer" },
    { Icon: Zap,       name: "Automation"     },
  ];

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#080810",
      display: "flex",
      fontFamily: "'Outfit', sans-serif",
      overflow: "hidden",
    }}>
      {/* Sidebar */}
      <div style={{
        width: 180, flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,.07)",
        padding: "20px 14px",
        background: "rgba(255,255,255,.015)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#fff",
          }}>S</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>Synth</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.map(n => (
            <div key={n.label} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 11px", borderRadius: 9, fontSize: 13,
              background: n.active ? "linear-gradient(135deg,rgba(124,58,237,.25),rgba(168,85,247,.12))" : "transparent",
              color: n.active ? "#c4b5fd" : "#71717a",
              border: n.active ? "1px solid rgba(124,58,237,.25)" : "1px solid transparent",
            }}>
              <n.Icon size={13} strokeWidth={1.8} />
              {n.label}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 12 }}>
            Agents
          </div>
          {AGENT_LIST.map(a => (
            <div key={a.name} style={{
              display: "flex", alignItems: "center", gap: 7,
              fontSize: 12, color: "#a1a1aa", padding: "6px 8px", borderRadius: 7,
            }}>
              <a.Icon size={12} strokeWidth={1.5} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Good morning, Alex</div>
          <div style={{
            fontSize: 11.5, padding: "5px 14px", borderRadius: 999,
            background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontWeight: 600,
          }}>+ New Agent</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,.04)",
              border: `1px solid ${i === 0 ? "rgba(124,58,237,.35)" : "rgba(255,255,255,.06)"}`,
              borderRadius: 12, padding: "12px 14px",
              boxShadow: i === 0 ? "0 0 12px rgba(124,58,237,.15)" : "none",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-.04em", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#71717a", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          flex: 1,
          background: "rgba(255,255,255,.025)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 14, padding: 16,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
            paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,.06)",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "rgba(124,58,237,.25)", border: "1px solid rgba(124,58,237,.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BarChart2 size={14} color="#a855f7" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Analytics Bot</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 500 }}>Online · Claude Sonnet</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-end" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                maxWidth: "68%", padding: "9px 13px",
                borderRadius: "12px 12px 4px 12px",
                background: "rgba(124,58,237,.3)", fontSize: 12, color: "#e9d5ff", lineHeight: 1.5,
              }}>
                What was our best performing channel last week?
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: "rgba(124,58,237,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BarChart2 size={11} color="#a855f7" strokeWidth={2} />
              </div>
              <div style={{
                maxWidth: "76%", padding: "9px 13px",
                borderRadius: "12px 12px 12px 4px",
                background: "rgba(255,255,255,.06)", fontSize: 12, color: "#e4e4e7", lineHeight: 1.55,
              }}>
                <span style={{ color: "#a855f7", fontWeight: 600, display: "block", fontSize: 11, marginBottom: 3 }}>Analytics Bot</span>
                Email had the highest CVR at 4.2% — up from 2.9% the week before. Organic search was #2 at 3.1%.
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: "rgba(124,58,237,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BarChart2 size={11} color="#a855f7" strokeWidth={2} />
              </div>
              <div style={{ display: "flex", gap: 4, padding: "9px 13px", borderRadius: 12, background: "rgba(255,255,255,.04)" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#a855f7", opacity: 0.7,
                    animation: `pulse-glow 1.2s ease-in-out ${i * 0.25}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
