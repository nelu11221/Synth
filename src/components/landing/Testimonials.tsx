"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Marquee } from "@/components/ui/marquee";

const ease = [.22, 1, .36, 1] as const;

function StarRow() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1l1.18 2.39L10 3.86 7.92 5.89l.44 2.88L6 7.53l-2.36 1.24.44-2.88L2 3.86l2.82-.47L6 1z"
            fill="#a855f7"
          />
        </svg>
      ))}
    </div>
  );
}

function TestCard({
  name, role, body, img,
}: {
  name: string; role: string; body: string; img: string;
}) {
  return (
    <div style={{
      width: "min(320px, 85vw)",
      flexShrink: 0,
      background: "rgba(14,10,28,0.82)",
      border: "1px solid rgba(124,58,237,0.18)",
      borderRadius: 18,
      padding: "20px 22px",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      margin: "0 8px",
    }}>
      <StarRow />
      <p style={{
        fontSize: 14, color: "#c4c4cc", lineHeight: 1.65,
        margin: "0 0 18px",
        fontFamily: "'Outfit', sans-serif",
      }}>
        &ldquo;{body}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={img}
          alt={name}
          width={36} height={36}
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(124,58,237,0.35)",
            flexShrink: 0,
            objectFit: "cover",
          }}
        />
        <div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: "#f4f4f5",
            letterSpacing: "-.02em", lineHeight: 1.2,
          }}>
            {name}
          </div>
          <div style={{ fontSize: 11.5, color: "#52525b", marginTop: 2 }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

const ROW_A = [
  { name: "Sarah Chen",     role: "CEO, TechStart",         body: "Synth transformed how our team works. Our AI agents handle 80% of routine tasks now.",                               img: "https://randomuser.me/api/portraits/women/32.jpg" },
  { name: "Marcus Rivera",  role: "CTO, DevFlow",            body: "Finally a platform where I can build custom AI agents for exactly what I need. Incredible.",                        img: "https://randomuser.me/api/portraits/men/51.jpg"   },
  { name: "Emma Williams",  role: "Product Manager",         body: "The team chat feature with multiple agents collaborating is mind-blowing. 10/10.",                                  img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "James Park",     role: "Content Creator",         body: "Set up my entire content workflow in minutes. My writing agent saves me 3 hours daily.",                            img: "https://randomuser.me/api/portraits/men/33.jpg"   },
  { name: "Lucia Santos",   role: "Research Lead",           body: "The Claude Opus integration for complex tasks is a game changer for our research team.",                            img: "https://randomuser.me/api/portraits/women/45.jpg" },
  { name: "Alex Thompson",  role: "Founder, AILabs",         body: "Best AI platform I've used. The customization is unmatched and setup takes minutes.",                               img: "https://randomuser.me/api/portraits/men/22.jpg"   },
];

const ROW_B = [
  { name: "Nina Patel",     role: "Data Engineer",           body: "Our database agent handles all SQL queries automatically. Revolutionary for our workflow.",                         img: "https://randomuser.me/api/portraits/women/53.jpg" },
  { name: "Tom Bradley",    role: "Engineering Lead",        body: "The smart routing between agents is incredibly accurate. It just works perfectly.",                                 img: "https://randomuser.me/api/portraits/men/61.jpg"   },
  { name: "Yuki Tanaka",    role: "Operations Manager",      body: "Switched from 5 different tools to just Synth. Productivity up 200% in the first week.",                           img: "https://randomuser.me/api/portraits/men/85.jpg"   },
  { name: "Priya Sharma",   role: "Support Lead, SaasCo",   body: "Our support agent resolves tickets 4x faster than before. ROI in the first week.",                                 img: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Daniel Novak",   role: "Product Lead, Codebase", body: "The Kanban board with AI agent assignment is genius. Tasks get done before I remember to check.",                  img: "https://randomuser.me/api/portraits/men/44.jpg"   },
  { name: "Amara Osei",     role: "Independent Consultant", body: "I run a solo consultancy and Synth is like having a full team. Completely changed my business.",                    img: "https://randomuser.me/api/portraits/women/76.jpg" },
];

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="divider" />
      <section className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>
        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute", top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 600,
          background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ textAlign: "center", marginBottom: 72, padding: "0 32px", position: "relative", zIndex: 1 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 14px", borderRadius: 999, marginBottom: 24,
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)",
          }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="3" fill="#a855f7" />
            </svg>
            <span style={{
              fontSize: 11, color: "#c4b5fd", fontWeight: 700,
              letterSpacing: ".08em", textTransform: "uppercase",
            }}>
              Testimonials
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(38px, 4.5vw, 58px)",
            fontWeight: 800, letterSpacing: "-.055em", lineHeight: 1.05,
            color: "#f4f4f5", margin: "0 0 20px",
          }}>
            Loved by teams{" "}
            <span style={{ color: "#52525b" }}>worldwide</span>
          </h2>

          <p style={{
            fontSize: 16, color: "#71717a", lineHeight: 1.7,
            maxWidth: "48ch", margin: "0 auto",
          }}>
            Join thousands of teams that replaced scattered AI tools with one coordinated platform.
          </p>
        </motion.div>

        {/* ── Row 1 — left to right ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ position: "relative", marginBottom: 16, overflow: "hidden" }}
        >
          <Marquee
            pauseOnHover={false}
            className="[--duration:35s] [--gap:16px]"
            repeat={6}
          >
            {ROW_A.map(t => <TestCard key={t.name} {...t} />)}
          </Marquee>

          <div aria-hidden style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: "15%",
            background: "linear-gradient(to right, #080808, transparent)",
            pointerEvents: "none", zIndex: 10,
          }} />
          <div aria-hidden style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "15%",
            background: "linear-gradient(to left, #080808, transparent)",
            pointerEvents: "none", zIndex: 10,
          }} />
        </motion.div>

        {/* ── Row 2 — right to left — hidden on mobile ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="hidden sm:block"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <Marquee
            reverse
            pauseOnHover={false}
            className="[--duration:42s] [--gap:16px]"
            repeat={6}
          >
            {ROW_B.map(t => <TestCard key={t.name} {...t} />)}
          </Marquee>

          <div aria-hidden style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: "15%",
            background: "linear-gradient(to right, #080808, transparent)",
            pointerEvents: "none", zIndex: 10,
          }} />
          <div aria-hidden style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "15%",
            background: "linear-gradient(to left, #080808, transparent)",
            pointerEvents: "none", zIndex: 10,
          }} />
        </motion.div>
      </section>
    </>
  );
}
