"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const CMD_DISPLAY = "$ npx synth create-agent --domain your-domain";
const CMD_COPY    = "npx synth create-agent --domain your-domain";

export function TerminalFloating() {
  const [cursor, setCursor] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(id);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CMD_COPY);
    } catch {
      /* fallback: do nothing */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.8, duration: 0.5, ease: [.22,1,.36,1] }}
      onClick={handleCopy}
      className="hidden sm:block"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "10px 14px",
        cursor: "pointer",
        userSelect: "none",
        minWidth: 350,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
        {/* Traffic lights */}
        {["#ff5f57","#ffbd2e","#28c840"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ fontSize: 10, color: "#52525b", fontFamily: "monospace", marginLeft: 4 }}>
          synth — terminal
        </span>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginLeft: "auto", fontSize: 10.5, color: "#22c55e",
                fontFamily: "monospace", fontWeight: 600,
              }}
            >
              <Check size={10} strokeWidth={2.5} style={{ marginRight: 3 }} /> copied!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Command line */}
      <div style={{
        fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
        fontSize: 12,
        color: "#22c55e",
        lineHeight: 1.5,
        display: "flex",
        alignItems: "center",
      }}>
        <span>{CMD_DISPLAY}</span>
        <span style={{
          display: "inline-block",
          width: 2,
          height: "1.1em",
          background: "#22c55e",
          marginLeft: 2,
          opacity: cursor ? 1 : 0,
          transition: "opacity 0.05s",
          verticalAlign: "middle",
        }} />
      </div>

      {/* Hint */}
      <div style={{ marginTop: 7, fontSize: 10, color: "#3f3f46", textAlign: "right" }}>
        click to copy
      </div>
    </motion.div>
  );
}
