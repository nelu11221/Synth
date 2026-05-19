"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";

const ease = [.22, 1, .36, 1] as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};


const PLANS = [
  {
    name: "Starter",
    desc: "Explore AI agents for free",
    mo: 0, yr: 0,
    features: [
      "2 AI agents",
      "100 messages / day",
      "Claude Haiku model",
      "Basic team chat",
      "Community support",
    ],
    cta: "Start for free",
    href: "/register",
    hi: false,
    accent: "rgba(255,255,255,0.07)",
  },
  {
    name: "Pro",
    desc: "Unlock your full AI team",
    mo: 29, yr: 23,
    features: [
      "8 AI agents",
      "Unlimited messages",
      "All 3 Claude models",
      "Team orchestration",
      "Kanban board",
      "Priority support",
    ],
    cta: "Start Pro trial",
    href: "/register",
    hi: true,
    accent: "rgba(124,58,237,0.2)",
  },
  {
    name: "Enterprise",
    desc: "Built for scale",
    mo: -1, yr: -1,
    features: [
      "Unlimited agents",
      "Self-hosted option",
      "Custom Claude models",
      "Full API access",
      "99.9% SLA",
      "Dedicated support",
    ],
    cta: "Contact sales",
    href: "mailto:hello@synth.ai",
    hi: false,
    accent: "rgba(255,255,255,0.07)",
  },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7l3 3L11.5 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <>
      <div className="divider" />
      <section id="pricing" className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        <div aria-hidden style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(124,58,237,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(236,72,153,0.15) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>

          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col sm:flex-row flex-wrap sm:justify-between sm:items-end"
            style={{ marginBottom: 48, gap: 24 }}
          >
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "5px 14px", borderRadius: 999, marginBottom: 20,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}>
                <span style={{
                  fontSize: 11, color: "#c4b5fd", fontWeight: 700,
                  letterSpacing: ".08em", textTransform: "uppercase",
                }}>
                  Pricing
                </span>
              </div>
              <h2 style={{
                fontSize: "clamp(38px, 4.5vw, 58px)",
                fontWeight: 800, letterSpacing: "-.055em", lineHeight: 1.05,
                color: "#fff", margin: 0,
              }}>
                Simple pricing,<br />
                <span style={{ color: "#52525b" }}>no surprises</span>
              </h2>
            </div>

            {/* Billing toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, color: !annual ? "#fff" : "#52525b", fontWeight: 500, transition: "color 0.2s" }}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                aria-label="Toggle annual billing"
                style={{
                  width: 44, height: 24, borderRadius: 999, border: "none",
                  cursor: "pointer", position: "relative",
                  background: annual
                    ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                    : "rgba(255,255,255,0.12)",
                  transition: "background 0.25s",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: "absolute", top: 4, width: 16, height: 16,
                  borderRadius: "50%", background: "#fff",
                  transition: "left 0.25s cubic-bezier(.32,.72,0,1)",
                  left: annual ? 24 : 4,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </button>
              <span style={{ fontSize: 14, color: annual ? "#fff" : "#52525b", fontWeight: 500, transition: "color 0.2s" }}>
                Annual{" "}
                <span style={{ color: "#4ade80", fontWeight: 700 }}>-20%</span>
              </span>
            </div>
          </motion.div>

          {/* Plan cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 16 }}
          >
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <GlassCard
                  variant={plan.hi ? "violet" : "default"}
                  style={{
                    borderRadius: 24,
                    padding: "32px 28px 28px",
                    display: "flex", flexDirection: "column",
                    position: "relative",
                    ...(plan.hi ? {
                      boxShadow: "0 0 60px rgba(124,58,237,0.2), inset 0 1.5px 0 rgba(168,85,247,0.4), 0 8px 32px rgba(0,0,0,0.3)",
                    } : {}),
                  }}
                >
                {/* Most popular badge */}
                {plan.hi && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    padding: "4px 16px", borderRadius: 999, whiteSpace: "nowrap",
                    letterSpacing: ".06em", textTransform: "uppercase",
                    boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
                  }}>
                    Most popular
                  </div>
                )}

                {/* Plan name & price */}
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{
                    fontSize: 18, fontWeight: 700, color: "#fff",
                    letterSpacing: "-.03em", margin: "0 0 4px",
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 20px" }}>{plan.desc}</p>

                  {plan.mo === -1 ? (
                    <div style={{
                      fontSize: 36, fontWeight: 900, color: "#fff",
                      letterSpacing: "-.06em", lineHeight: 1,
                    }}>
                      Custom
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{
                        fontSize: 40, fontWeight: 900, color: "#fff",
                        letterSpacing: "-.06em", lineHeight: 1,
                      }}>
                        ${annual ? plan.yr : plan.mo}
                      </span>
                      <span style={{ fontSize: 14, color: "#52525b" }}>/mo</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: plan.hi
                    ? "rgba(124,58,237,0.3)"
                    : "rgba(255,255,255,0.06)",
                  marginBottom: 24,
                }} />

                {/* Features */}
                <ul style={{
                  listStyle: "none", padding: 0, margin: "0 0 28px",
                  flex: 1, display: "flex", flexDirection: "column", gap: 10,
                }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#a1a1aa" }}>
                      <CheckIcon color={plan.hi ? "#a855f7" : "#52525b"} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => plan.href.startsWith("mailto:")
                    ? (window.location.href = plan.href)
                    : router.push(plan.href)
                  }
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    borderRadius: 12,
                    fontSize: 14, fontWeight: 700,
                    border: "none", cursor: "pointer",
                    background: plan.hi
                      ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                      : "rgba(255,255,255,0.07)",
                    color: "#fff",
                    boxShadow: plan.hi ? "0 4px 20px rgba(124,58,237,0.35)" : "none",
                    transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-1px)";
                    if (plan.hi) el.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)";
                    else el.style.background = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    if (plan.hi) el.style.boxShadow = "0 4px 20px rgba(124,58,237,0.35)";
                    else el.style.background = "rgba(255,255,255,0.07)";
                  }}
                >
                  {plan.cta}
                </button>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
