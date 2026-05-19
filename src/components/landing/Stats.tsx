"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [.22,1,.36,1] as const;

const STATS = [
  { val:"∞",    label:"Agent Types",   desc:"Any domain, any specialty" },
  { val:"3",    label:"AI Models",     desc:"Haiku, Sonnet, Opus" },
  { val:"24/7", label:"Availability",  desc:"Your team never sleeps" },
  { val:"100%", label:"Your Data",     desc:"Encrypted, private, yours" },
];

export function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });

  return (
    <>
      <div className="divider" />
      <section style={{ padding:"100px 0" }}>
        <div className="container">
          <motion.div
            ref={ref}
            initial={{ opacity:0, y:24 }}
            animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:.65, ease }}
            style={{
              display:"grid",
              gridTemplateColumns:"repeat(4,1fr)",
              borderRadius:20, overflow:"hidden",
              border:"1px solid rgba(255,255,255,.07)",
              background:"rgba(255,255,255,.02)",
            }}
          >
            {STATS.map((s,i) => (
              <div key={s.label} style={{
                padding:"44px 28px",
                borderRight:i<3?"1px solid rgba(255,255,255,.07)":"none",
                position:"relative", overflow:"hidden",
              }}>
                {/* Subtle glow */}
                <div style={{
                  position:"absolute",top:0,left:0,right:0,height:2,
                  background:"linear-gradient(90deg,transparent,rgba(168,85,247,.5),transparent)",
                  opacity:i===1?.8:.3,
                }} />

                <div style={{
                  fontSize:"clamp(36px,4vw,52px)",fontWeight:900,
                  letterSpacing:"-.06em",lineHeight:1,marginBottom:10,
                  background:"linear-gradient(135deg,#c084fc,#a78bfa,#f472b6)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                }}>{s.val}</div>
                <div style={{ fontSize:14,fontWeight:600,color:"#fff",marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:12.5,color:"#52525b" }}>{s.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
