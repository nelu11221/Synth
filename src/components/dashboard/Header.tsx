"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const breadcrumbs: Record<string, string> = {
  "/dashboard":           "Overview",
  "/dashboard/agents":    "Agents",
  "/dashboard/agents/new":"New Agent",
  "/dashboard/team":      "Team Chat",
  "/dashboard/tasks":     "Tasks",
  "/dashboard/settings":  "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const label = breadcrumbs[pathname] || "Dashboard";
  const isAgentChat = pathname.startsWith("/dashboard/agents/") && pathname !== "/dashboard/agents" && pathname !== "/dashboard/agents/new";

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-16 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(8,8,8,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 30,
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 13, color: "#3f3f46", fontFamily: "'Outfit',sans-serif" }}>Synth</span>
        <ChevronRight size={12} color="#3f3f46" strokeWidth={2} />
        <span style={{ fontSize: 13, color: isAgentChat ? "#71717a" : "#f4f4f5", fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>
          {isAgentChat ? "Agents" : label}
        </span>
        {isAgentChat && (
          <>
            <ChevronRight size={12} color="#3f3f46" strokeWidth={2} />
            <span style={{ fontSize: 13, color: "#f4f4f5", fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>Chat</span>
          </>
        )}
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-3">
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 12, color: "#a1a1aa", fontFamily: "'Outfit',sans-serif", margin: 0 }}>
            {session?.user?.name || "User"}
          </p>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg,#7c3aed,#a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
          boxShadow: "0 0 10px rgba(124,58,237,0.3)",
        }}>
          {session?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </motion.header>
  );
}
