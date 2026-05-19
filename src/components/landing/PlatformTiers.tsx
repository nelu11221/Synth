"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BarChart2, Code2, PenTool, LineChart,
  Headphones, Search, Mail, ImageIcon,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const ease = [.22, 1, .36, 1] as const;

const MODEL_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  Sonnet:       { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)",  color: "#c084fc" },
  Opus:         { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)",  color: "#fb923c" },
  Haiku:        { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)",   color: "#4ade80" },
  "Coming Soon":{ bg: "rgba(100,116,139,0.12)",border: "rgba(100,116,139,0.25)",color: "#94a3b8" },
};

function ModelBadge({ model }: { model: string }) {
  const s = MODEL_STYLES[model] ?? MODEL_STYLES.Sonnet;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 999,
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: 10.5, fontWeight: 700, color: s.color,
      letterSpacing: ".06em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {model === "Coming Soon" ? model : `Claude ${model}`}
    </span>
  );
}

interface AgentCard {
  Icon: LucideIcon;
  name: string;
  domain: string;
  model: string;
  bullets: string[];
  soon?: boolean;
}

const AGENTS: AgentCard[] = [
  {
    Icon: BarChart2,
    name: "SEO Optimizer",
    domain: "Content & SEO",
    model: "Sonnet",
    bullets: ["Keyword research & gap analysis", "Meta tag optimization", "Competitor SERP analysis"],
  },
  {
    Icon: Code2,
    name: "Code Reviewer",
    domain: "Engineering",
    model: "Opus",
    bullets: ["PR reviews with inline comments", "Bug detection & security audit", "Refactoring suggestions"],
  },
  {
    Icon: PenTool,
    name: "Content Writer",
    domain: "Marketing",
    model: "Sonnet",
    bullets: ["Blog posts & long-form articles", "Social media copy", "Email campaign sequences"],
  },
  {
    Icon: LineChart,
    name: "Data Analyst",
    domain: "Analytics",
    model: "Opus",
    bullets: ["CSV processing & visualization", "Weekly reports generation", "Trend identification"],
  },
  {
    Icon: Headphones,
    name: "Support Agent",
    domain: "Customer Success",
    model: "Haiku",
    bullets: ["Ticket triage & auto-response", "FAQ knowledge base answers", "Smart escalation routing"],
  },
  {
    Icon: Search,
    name: "Research Bot",
    domain: "Research",
    model: "Sonnet",
    bullets: ["Web search & synthesis", "Fact-checking & citations", "Competitive intelligence"],
  },
  {
    Icon: Mail,
    name: "Email Manager",
    domain: "Productivity",
    model: "Haiku",
    bullets: ["Inbox prioritization", "Draft & send replies", "Meeting scheduling"],
  },
  {
    Icon: ImageIcon,
    name: "Image Generator",
    domain: "Visual AI",
    model: "Coming Soon",
    bullets: ["Brand-consistent visuals", "Social media assets", "Edit & resize images"],
    soon: true,
  },
];

export function AgentExamples() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="divider" />
      <section id="agent-examples" className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        <div aria-hidden style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(124,58,237,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(236,72,153,0.12) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 50% 85%, rgba(99,102,241,0.12) 0%, transparent 70%)",
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
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" fill="#a855f7" />
              </svg>
              <span style={{
                fontSize: 11, color: "#c4b5fd", fontWeight: 700,
                letterSpacing: ".08em", textTransform: "uppercase",
              }}>
                Agent examples
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(38px, 4.5vw, 58px)",
              fontWeight: 800, letterSpacing: "-.055em", lineHeight: 1.05,
              color: "#f4f4f5", margin: "0 0 20px",
            }}>
              What teams build{" "}
              <span style={{ color: "#52525b" }}>with Synth</span>
            </h2>

            <p style={{
              fontSize: 16, color: "#71717a", lineHeight: 1.7,
              maxWidth: "50ch", margin: "0 auto",
            }}>
              Real-world agents shipped by teams on Synth.
              Configure any of these in under 5 minutes.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 14 }}>
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.06 + i * 0.07, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              >
                <GlassCard style={{ borderRadius: 20, padding: "22px 20px 20px", display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                {/* Coming Soon ribbon */}
                {agent.soon && (
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    padding: "2px 8px", borderRadius: 999,
                    background: "rgba(100,116,139,0.15)",
                    border: "1px solid rgba(100,116,139,0.25)",
                    fontSize: 9, fontWeight: 700, color: "#94a3b8",
                    letterSpacing: ".08em", textTransform: "uppercase",
                  }}>
                    Soon
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <agent.Icon size={18} color="#a855f7" strokeWidth={1.8} />
                </div>

                {/* Name + Domain */}
                <div>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: "#f4f4f5",
                    letterSpacing: "-.03em", marginBottom: 3,
                  }}>
                    {agent.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#52525b" }}>{agent.domain}</div>
                </div>

                {/* Model badge */}
                <ModelBadge model={agent.model} />

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: "rgba(255,255,255,0.05)",
                }} />

                {/* Bullet points */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  {agent.bullets.map(b => (
                    <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                      <div style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: "#52525b", flexShrink: 0, marginTop: 6,
                      }} />
                      <span style={{ fontSize: 12, color: "#71717a", lineHeight: 1.5 }}>{b}</span>
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
