"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ease = [.22,1,.36,1] as const;

/* ── Network Diagram ── */
const W = 860, H = 360, CX = W / 2, CY = H / 2, R = 148;

const NET_NODES = [
  { label: "Claude Haiku",  angle:   0, color: "#22c55e"  },
  { label: "Claude Sonnet", angle:  45, color: "#a855f7"  },
  { label: "Claude Opus",   angle:  90, color: "#7c3aed"  },
  { label: "Team Chat",     angle: 135, color: "#ec4899"  },
  { label: "Task Manager",  angle: 180, color: "#f59e0b"  },
  { label: "Memory",        angle: 225, color: "#8b5cf6"  },
  { label: "Monitoring",    angle: 270, color: "#06b6d4"  },
  { label: "Custom Domain", angle: 315, color: "#10b981"  },
].map(n => ({
  ...n,
  x: CX + R * Math.cos((n.angle * Math.PI) / 180),
  y: CY + R * Math.sin((n.angle * Math.PI) / 180),
}));

function NetworkDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease }}
      style={{ display: "flex", justifyContent: "center", marginBottom: 64 }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", maxWidth: W, overflow: "visible" }}
      >
        <defs>
          <radialGradient id="netGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Center radial glow */}
        <circle cx={CX} cy={CY} r={88} fill="url(#netGlow)" />

        {/* Animated connecting lines */}
        {NET_NODES.map((n, i) => (
          <motion.path
            key={n.label + "-line"}
            d={`M ${CX} ${CY} L ${n.x} ${n.y}`}
            stroke={n.color}
            strokeWidth={1.2}
            strokeOpacity={0.45}
            strokeDasharray="5 10"
            fill="none"
            animate={{ strokeDashoffset: [0, -15] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.18 }}
          />
        ))}

        {/* Peripheral pill nodes */}
        {NET_NODES.map(n => (
          <g key={n.label}>
            <rect
              x={n.x - 56} y={n.y - 14}
              width={112} height={28}
              rx={14}
              fill={`${n.color}12`}
              stroke={`${n.color}45`}
              strokeWidth={1}
            />
            <text
              x={n.x} y={n.y + 4.5}
              textAnchor="middle"
              fontSize={10.5}
              fontWeight={600}
              fill="#d4d4d8"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Center pulse ring */}
        <motion.circle
          cx={CX} cy={CY} r={38}
          fill="none"
          stroke="rgba(124,58,237,0.5)"
          strokeWidth={1.5}
          animate={{ r: [38, 58], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Center node */}
        <circle cx={CX} cy={CY} r={38} fill="rgba(124,58,237,0.18)" stroke="rgba(124,58,237,0.6)" strokeWidth={1.5} />
        <text x={CX} y={CY - 5}  textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff"    style={{ fontFamily: "Inter, sans-serif" }}>S</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#a855f7" letterSpacing="0.07em" style={{ fontFamily: "Inter, sans-serif" }}>SYNTH</text>
      </svg>
    </motion.div>
  );
}

const AGENTS = [
  { emoji:"🎯",name:"Strategy & Planning",model:"Claude Opus",color:"#7c3aed",tag:"Complex reasoning",
    desc:"High-level strategic thinking, competitive analysis, OKR planning, and long-term roadmaps." },
  { emoji:"💻",name:"Web Development",model:"Claude Sonnet",color:"#a855f7",tag:"Code generation",
    desc:"Full-stack development, architecture design, code reviews, debugging, and technical docs." },
  { emoji:"✍️",name:"Content & Copy",model:"Claude Sonnet",color:"#ec4899",tag:"Creative writing",
    desc:"SEO blog posts, ad copy, email campaigns, brand voice, and social media content." },
  { emoji:"🗄️",name:"Database & Data",model:"Claude Sonnet",color:"#06b6d4",tag:"Analytics",
    desc:"SQL queries, data pipelines, dashboards, ETL processes, and data visualization." },
  { emoji:"⚡",name:"Automation",model:"Claude Haiku",color:"#10b981",tag:"Fast & efficient",
    desc:"Workflow automation, API integrations, scripts, and repetitive task elimination." },
  { emoji:"📊",name:"Monitoring",model:"Claude Haiku",color:"#f59e0b",tag:"24/7 alerting",
    desc:"System health monitoring, anomaly detection, performance tracking, and incident reports." },
  { emoji:"🎨",name:"Image Generation",model:"Coming Soon",color:"#f97316",tag:"Visual AI",
    desc:"AI image creation, design briefs, visual content strategy, and brand asset generation.",soon:true },
  { emoji:"🧠",name:"Memory & Context",model:"Claude Haiku",color:"#8b5cf6",tag:"Knowledge base",
    desc:"Long-term memory management, knowledge retrieval, context chaining, and note-taking." },
];

function AgentCard({ a, i }: { a: typeof AGENTS[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-40px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:24 }}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:.5, delay:i*.06, ease }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"relative",
        background:"rgba(255,255,255,0.03)",
        border:`1px solid ${hov?a.color+"55":"rgba(255,255,255,.08)"}`,
        borderRadius:16, padding:20, minHeight:200,
        display:"flex",flexDirection:"column",gap:10,
        cursor:"default",
        transition:"border-color .2s, box-shadow .2s",
        boxShadow:hov?`0 0 30px ${a.color}20`:"none",
      }}
    >
      {a.soon && (
        <div style={{
          position:"absolute",top:12,right:12,
          background:"linear-gradient(135deg,#f97316,#ec4899)",
          color:"#fff",fontSize:9,fontWeight:700,
          padding:"3px 8px",borderRadius:999,letterSpacing:".06em",
        }}>SOON</div>
      )}

      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{
          width:42,height:42,borderRadius:11,flexShrink:0,
          background:`${a.color}18`,border:`1px solid ${a.color}35`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
          transition:"box-shadow .2s",
          boxShadow:hov?`0 0 20px ${a.color}40`:"none",
        }}>{a.emoji}</div>
        <div>
          <div style={{ fontSize:13,fontWeight:600,color:"#fff",lineHeight:1.2 }}>{a.name}</div>
          <div style={{ fontSize:11,color:a.color,fontWeight:500,marginTop:2 }}>{a.tag}</div>
        </div>
      </div>

      <p style={{ fontSize:12.5,color:"#71717a",lineHeight:1.6,margin:0,flex:1 }}>{a.desc}</p>

      <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:4 }}>
        <div style={{ width:5,height:5,borderRadius:"50%",background:a.color,flexShrink:0 }} />
        <span style={{ fontSize:11,color:a.color,fontWeight:500 }}>{a.model}</span>
      </div>
    </motion.div>
  );
}

export function AgentsShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });

  return (
    <>
      <div className="divider" />
      <section id="agents" className="section">
        <div className="container">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity:0, y:20 }}
            animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:.6, ease }}
            style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:56 }}
          >
            <div>
              <span style={{ fontSize:12,fontWeight:700,letterSpacing:".12em",
                textTransform:"uppercase",color:"#a855f7",display:"block",marginBottom:14 }}>
                Agents
              </span>
              <h2 style={{ fontSize:"clamp(36px,3.5vw,52px)",fontWeight:800,
                letterSpacing:"-.05em",lineHeight:1.1,margin:0 }}>
                Meet your AI team
              </h2>
            </div>
            <div style={{
              padding:"8px 16px",borderRadius:999,fontSize:12,color:"#71717a",
              background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
              maxWidth:280, textAlign:"right",
            }}>
              These are examples — create <strong style={{ color:"#a1a1aa" }}>any agent</strong> you need
            </div>
          </motion.div>

          {/* Network diagram */}
          <NetworkDiagram />

          {/* Grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
            {AGENTS.map((a,i) => <AgentCard key={a.name} a={a} i={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
