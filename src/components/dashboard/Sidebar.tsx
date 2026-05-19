"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Bot, MessageSquare, CheckSquare,
  Settings, LogOut, type LucideIcon,
} from "lucide-react";

interface NavItem { href: string; label: string; Icon: LucideIcon; }

const navItems: NavItem[] = [
  { href: "/dashboard",          label: "Overview",  Icon: LayoutDashboard },
  { href: "/dashboard/agents",   label: "Agents",    Icon: Bot             },
  { href: "/dashboard/team",     label: "Team Chat", Icon: MessageSquare   },
  { href: "/dashboard/tasks",    label: "Tasks",     Icon: CheckSquare     },
  { href: "/dashboard/settings", label: "Settings",  Icon: Settings        },
];

interface Agent { id: string; name: string; emoji: string; color: string; isActive: boolean; }

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => setAgents(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => {});
  }, []);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-40"
      style={{
        background: "rgba(6,6,8,0.92)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 0 12px rgba(124,58,237,0.35)" }}
          >
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-.02em", fontFamily: "'Outfit',sans-serif" }}>
            Synth
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item, i) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group"
                style={active ? {
                  background: "rgba(124,58,237,0.15)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(124,58,237,0.25)",
                  boxShadow: "0 0 12px rgba(124,58,237,0.1)",
                } : {
                  color: "#71717a",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "#d4d4d8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.background = "transparent"; } }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(124,58,237,0.08)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <item.Icon size={15} strokeWidth={1.8} style={{ flexShrink: 0, position: "relative", zIndex: 1 }} />
                <span style={{ position: "relative", zIndex: 1, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 600 : 400 }}>
                  {item.label}
                </span>
                {active && (
                  <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 4px #a855f7" }} />
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* Agents list */}
        <AnimatePresence>
          {agents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-xs px-3 mb-2 font-semibold tracking-widest uppercase"
                style={{ color: "#3f3f46" }}>
                Agents
              </p>
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.04 }}
                >
                  <Link
                    href={`/dashboard/agents/${agent.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200"
                    style={{ color: "#71717a" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#d4d4d8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <span className="text-sm" style={{ flexShrink: 0 }}>{agent.emoji}</span>
                    <span className="truncate flex-1" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>{agent.name}</span>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: agent.isActive ? "#22c55e" : "#3f3f46", boxShadow: agent.isActive ? "0 0 4px #22c55e" : "none" }} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* User */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 0 8px rgba(124,58,237,0.3)" }}
          >
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs truncate" style={{ color: "#52525b" }}>{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            className="transition-all duration-200 rounded-lg p-1.5 flex-shrink-0"
            style={{ color: "#52525b" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#52525b"; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={13} strokeWidth={1.8} />
          </button>
        </div>
      </motion.div>
    </motion.aside>
  );
}
