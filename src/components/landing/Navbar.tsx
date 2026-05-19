"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

const ease = [.22, 1, .36, 1] as const;

const NAV_LINKS = [
  { label: "Why Synth", href: "#why-fails" },
  { label: "Features",  href: "#features"  },
  { label: "Pricing",   href: "#pricing"   },
];

const pillStyle = (scrolled: boolean): React.CSSProperties => ({
  backdropFilter:         "blur(24px)",
  WebkitBackdropFilter:   "blur(24px)",
  background:             scrolled ? "rgba(6,6,8,0.92)" : "rgba(12,12,16,0.55)",
  border:                 "1px solid rgba(255,255,255,0.09)",
  boxShadow:              scrolled
    ? "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset"
    : "0 4px 16px rgba(0,0,0,0.25)",
  transition: "background 0.3s ease, box-shadow 0.3s ease",
});

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { data: session }          = useSession();
  const router                     = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close menu on route change / resize */
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const ctaBtn = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 18px", height: 36, borderRadius: 999,
        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
        color: "#fff", fontSize: 13, fontWeight: 600,
        border: "none", cursor: "pointer",
        boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {label}
    </button>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "16px 16px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>

        {/* ── Pill row ── */}
        <div
          style={{
            ...pillStyle(scrolled),
            borderRadius: 999,
            padding: "0 20px",
            height: 54,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px rgba(124,58,237,0.4)",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-.04em" }}>S</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15.5, letterSpacing: "-.03em", fontFamily: "'Outfit', sans-serif" }}>
              Synth
            </span>
          </Link>

          {/* Desktop nav — flex:1 so it fills space and centers links */}
          <nav className="hidden md:flex" style={{ flex: 1, justifyContent: "center", gap: 4 }}>
            {NAV_LINKS.map(n => (
              <a
                key={n.label}
                href={n.href}
                style={{
                  color: "#6b6b7a", fontSize: 13.5, fontWeight: 500,
                  textDecoration: "none", padding: "6px 14px", borderRadius: 999,
                  transition: "color 0.2s, background 0.2s",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#6b6b7a"; e.currentTarget.style.background = "transparent"; }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA — hidden on mobile, never shrinks */}
          <div className="hidden md:flex" style={{ gap: 8, alignItems: "center", flexShrink: 0, marginLeft: "auto" }}>
            {session ? (
              ctaBtn("Dashboard →", () => router.push("/dashboard"))
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ color: "#6b6b7a", fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "6px 14px", borderRadius: 999, transition: "color 0.2s", fontFamily: "'Outfit', sans-serif" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#6b6b7a")}
                >
                  Sign in
                </Link>
                {ctaBtn("Get started", () => router.push("/register"))}
              </>
            )}
          </div>

          {/* Mobile hamburger — hidden on desktop */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
              padding: "6px",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {menuOpen ? <X size={20} color="#fff" strokeWidth={2} /> : <Menu size={20} color="#fff" strokeWidth={2} />}
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease }}
              className="md:hidden"
              style={{
                marginTop: 8,
                borderRadius: 18,
                background: "rgba(6,6,8,0.96)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {NAV_LINKS.map((n, i) => (
                <motion.a
                  key={n.label}
                  href={n.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: "#a1a1aa", fontSize: 15, fontWeight: 500,
                    textDecoration: "none", padding: "12px 16px", borderRadius: 12,
                    display: "block", transition: "color 0.2s, background 0.2s",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.background = "transparent"; }}
                >
                  {n.label}
                </motion.a>
              ))}

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 8, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {session ? (
                  <button
                    onClick={() => { router.push("/dashboard"); setMenuOpen(false); }}
                    style={{
                      padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      color: "#fff", fontSize: 14, fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    Dashboard →
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        padding: "12px 16px", borderRadius: 12, textDecoration: "none",
                        color: "#a1a1aa", fontSize: 14, fontWeight: 500,
                        textAlign: "center", fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Sign in
                    </Link>
                    <button
                      onClick={() => { router.push("/register"); setMenuOpen(false); }}
                      style={{
                        padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                        color: "#fff", fontSize: 14, fontWeight: 600,
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Get started
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
