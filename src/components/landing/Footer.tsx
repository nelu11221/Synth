"use client";

import Link from "next/link";

const LINKS = {
  Product:  ["Features", "Agents", "Pricing", "Changelog"],
  Company:  ["About", "Blog", "Careers", "Press"],
  Legal:    ["Privacy", "Terms", "Security"],
};

export function Footer() {
  return (
    <>
      <div className="divider" />
      <footer style={{ padding: "72px 0 48px", position: "relative" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>

          {/* Top row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
            style={{ gap: 32, marginBottom: 48 }}
          >

            {/* Brand */}
            <div>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 12px rgba(124,58,237,0.35)",
                }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, letterSpacing: "-.04em" }}>S</span>
                </div>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "-.03em" }}>Synth</span>
              </Link>

              <p style={{
                fontSize: 14, color: "#3f3f46", lineHeight: 1.65,
                maxWidth: "30ch", margin: "0 0 24px",
              }}>
                AI agents platform for teams that refuse to slow down.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                {/* X/Twitter */}
                <a href="#" aria-label="Twitter" style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#52525b">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.259 5.628L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                  </svg>
                </a>
                {/* GitHub */}
                <a href="#" aria-label="GitHub" style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#52525b">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(LINKS).map(([col, items]) => (
              <div key={col}>
                <h4 style={{
                  fontSize: 12, fontWeight: 700, color: "#fff",
                  letterSpacing: ".07em", textTransform: "uppercase",
                  margin: "0 0 18px",
                }}>
                  {col}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(item => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        style={{
                          fontSize: 14, color: "#52525b", textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#a1a1aa")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#52525b")}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
            style={{ gap: 8, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p style={{ fontSize: 13, color: "#3f3f46", margin: 0 }}>
              © 2025 Synth. All rights reserved.
            </p>
            <p style={{ fontSize: 13, color: "#3f3f46", margin: 0 }}>
              Built with{" "}
              <span style={{ color: "#a855f7" }}>Claude</span>
              {" "}by Anthropic
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
