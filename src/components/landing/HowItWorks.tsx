"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const STEPS = [
  {
    num: "01",
    title: "Configure your agents",
    body: "Define each agent's name, persona, expertise area, and Claude model. Give them specific instructions that match your team's workflow — no prompt engineering needed.",
    tags: ["Name & persona", "Model selection", "Custom instructions"],
  },
  {
    num: "02",
    title: "Put them to work",
    body: "Chat directly with any agent or drop tasks into the shared team channel. Agents can call on each other, escalate complex tasks, and hand off work seamlessly.",
    tags: ["Direct chat", "Team channel", "Agent hand-offs"],
  },
  {
    num: "03",
    title: "Watch them collaborate",
    body: "Synth routes messages to the right agent automatically. Track progress on the Kanban board, review conversation history, and iterate on agents as your needs evolve.",
    tags: ["Smart routing", "Kanban board", "Full audit trail"],
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <>
      <div className="divider" />
      <section id="how-it-works" className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        <div aria-hidden style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 55% at 80% 60%, rgba(124,58,237,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 30%, rgba(236,72,153,0.12) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>

          {/* Header */}
          <motion.div
            ref={ref}
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{ marginBottom: 80 }}
          >
            <motion.div variants={fadeUp}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "5px 14px", borderRadius: 999, marginBottom: 24,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}>
                <span style={{
                  fontSize: 11, color: "#c4b5fd", fontWeight: 700,
                  letterSpacing: ".08em", textTransform: "uppercase",
                }}>
                  How it works
                </span>
              </div>

              <h2 style={{
                fontSize: "clamp(38px, 4.5vw, 62px)",
                fontWeight: 800, letterSpacing: "-.055em", lineHeight: 1.05,
                color: "#f4f4f5", margin: 0, maxWidth: 560,
              }}>
                Up and running<br />
                <span style={{ color: "#52525b" }}>in minutes</span>
              </h2>
            </motion.div>
          </motion.div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS.map((step, i) => (
              <div key={step.num}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  transition={{ delay: i * 0.15 }}
                  className="grid grid-cols-1 md:grid-cols-[180px_1fr]"
                  style={{
                    gap: 32,
                    alignItems: "center",
                    padding: "40px 0",
                  }}
                >
                  {/* Step number */}
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    {/* Ghost number */}
                    <div className="step-num-bg" style={{
                      position: "absolute",
                      fontSize: "clamp(90px, 12vw, 140px)",
                      fontWeight: 900, color: "#f4f4f5",
                      letterSpacing: "-.08em", lineHeight: 1,
                      userSelect: "none", left: -16, top: "50%",
                      transform: "translateY(-50%)", zIndex: 0,
                    }}>
                      {step.num}
                    </div>
                    {/* Violet number */}
                    <div style={{
                      position: "relative", zIndex: 1,
                      fontSize: "clamp(52px, 7vw, 80px)",
                      fontWeight: 900, letterSpacing: "-.06em",
                      lineHeight: 1, color: "#7c3aed",
                    }}>
                      {step.num}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{
                      fontSize: "clamp(22px, 2.2vw, 30px)",
                      fontWeight: 800, letterSpacing: "-.04em",
                      color: "#f4f4f5", margin: "0 0 14px",
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: 16, color: "#71717a", lineHeight: 1.75,
                      margin: "0 0 20px", maxWidth: "60ch",
                    }}>
                      {step.body}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {step.tags.map(tag => (
                        <span key={tag} style={{
                          padding: "4px 12px", borderRadius: 999,
                          background: "rgba(124,58,237,0.08)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          fontSize: 12, fontWeight: 600, color: "#c4b5fd",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Separator */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    height: 1,
                    background: "linear-gradient(90deg, rgba(124,58,237,0.2) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
