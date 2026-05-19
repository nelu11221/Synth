"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const ease = [.22, 1, .36, 1] as const;

export function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();

  return (
    <>
      <div className="divider" />
      <section className="py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>

        {/* Gradient mesh background orbs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div className="mesh-orb" style={{
            position: "absolute", top: "10%", left: "15%",
            width: 500, height: 500,
            background: "radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 65%)",
            filter: "blur(80px)", borderRadius: "50%",
          }} />
          <div className="mesh-orb" style={{
            position: "absolute", top: "20%", right: "10%",
            width: 400, height: 400,
            background: "radial-gradient(ellipse, rgba(236,72,153,0.14) 0%, transparent 65%)",
            filter: "blur(90px)", borderRadius: "50%",
            animationDelay: "4s",
          }} />
          <div className="mesh-orb" style={{
            position: "absolute", bottom: "5%", left: "40%",
            width: 450, height: 350,
            background: "radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)",
            filter: "blur(70px)", borderRadius: "50%",
            animationDelay: "8s",
          }} />

          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          }} />
        </div>

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>

          {/* Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            style={{
              textAlign: "center",
              padding: "80px 48px",
              borderRadius: 32,
              border: "1px solid rgba(124,58,237,0.2)",
              background: "rgba(8,8,12,0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Inner card glow */}
            <div aria-hidden style={{
              position: "absolute", top: -100, left: "50%",
              transform: "translateX(-50%)",
              width: 600, height: 300,
              background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)",
              filter: "blur(40px)", pointerEvents: "none",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "5px 14px", borderRadius: 999, marginBottom: 32,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" fill="#a855f7" />
              </svg>
              <span style={{
                fontSize: 11, color: "#c4b5fd", fontWeight: 700,
                letterSpacing: ".08em", textTransform: "uppercase",
              }}>
                Ready to start
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(40px, 5vw, 68px)",
              fontWeight: 900, letterSpacing: "-.06em", lineHeight: 1.02,
              color: "#fff", margin: "0 auto 20px",
              maxWidth: 700, position: "relative", zIndex: 1,
            }}>
              Build your AI team today
            </h2>

            <p style={{
              fontSize: 18, color: "#71717a", lineHeight: 1.7,
              maxWidth: "50ch", margin: "0 auto 48px",
              position: "relative", zIndex: 1,
            }}>
              Set up your first specialized agent in under 5 minutes.
              No prompt engineering, no complex setup — just results.
            </p>

            {/* Two buttons */}
            <div
              className="flex flex-col sm:flex-row flex-wrap justify-center items-center"
              style={{ gap: 14, position: "relative", zIndex: 1 }}
            >
              <button
                onClick={() => router.push("/register")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "0 28px", height: 52, borderRadius: 999,
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(124,58,237,0.45)",
                  transition: "transform 0.2s cubic-bezier(.32,.72,0,1), box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(124,58,237,0.6)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(124,58,237,0.45)";
                }}
                onMouseDown={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(0.98)"}
                onMouseUp={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
              >
                Start for free
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>
                  →
                </div>
              </button>

              <button
                onClick={() => (window.location.href = "mailto:hello@synth.ai")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "0 28px", height: 52, borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: 15, fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Talk to sales
              </button>
            </div>

            {/* Trust line */}
            <p style={{
              fontSize: 13, color: "#3f3f46", marginTop: 32,
              position: "relative", zIndex: 1,
            }}>
              No credit card required · Cancel anytime · GDPR compliant
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
