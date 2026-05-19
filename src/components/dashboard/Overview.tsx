"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bot, CheckSquare, MessageSquare, Zap,
  Radio, ClipboardList, Settings, Plus,
  type LucideIcon,
} from "lucide-react";

interface Props {
  userName: string;
  stats: {
    activeAgents: number;
    completedTasks: number;
    todayMessages: number;
    timeSaved: number;
  };
  agents: any[];
  tasks: any[];
  recentMessages: any[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
});

interface StatCardProps { label: string; value: string; Icon: LucideIcon; delay: number; accent: string; }

function StatCard({ label, value, Icon, delay, accent }: StatCardProps) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "20px",
      }}
      whileHover={{ borderColor: `${accent}44`, transition: { duration: 0.2 } }}
    >
      {/* Accent top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        borderRadius: "16px 16px 0 0",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: -20, left: -20, width: 80, height: 80,
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
        }}>
          <Icon size={15} color={accent} strokeWidth={1.8} />
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
      </div>
      <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Outfit',sans-serif", letterSpacing: "-.03em" }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: "#71717a", fontFamily: "'Outfit',sans-serif" }}>{label}</div>
    </motion.div>
  );
}

export function DashboardOverview({ userName, stats, agents, tasks, recentMessages }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.04em", margin: 0 }}>
          {greeting}, {userName}
        </h1>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, fontFamily: "'Outfit',sans-serif" }}>
          Here&apos;s what&apos;s happening with your AI team today.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Agents"   value={String(stats.activeAgents)}         Icon={Bot}           delay={0.08} accent="#a855f7" />
        <StatCard label="Tasks Completed" value={String(stats.completedTasks)}        Icon={CheckSquare}   delay={0.13} accent="#22c55e" />
        <StatCard label="Messages Today"  value={String(stats.todayMessages)}         Icon={MessageSquare} delay={0.18} accent="#7c3aed" />
        <StatCard label="Hours Saved"     value={`${stats.timeSaved.toFixed(1)}h`}    Icon={Zap}           delay={0.23} accent="#f97316" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div {...fadeUp(0.28)} className="rounded-2xl" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: 20,
        }}>
          <h2 className="flex items-center gap-2 mb-4" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Radio size={12} color="#a855f7" strokeWidth={1.8} />
            </div>
            Recent Activity
          </h2>
          {recentMessages.length === 0 ? (
            <div className="text-center py-10">
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <MessageSquare size={20} color="#3f3f46" strokeWidth={1.5} />
              </div>
              <p style={{ color: "#52525b", fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>No activity yet.</p>
              <Link href="/dashboard/agents/new" style={{ display: "inline-block", marginTop: 10, fontSize: 13, color: "#a855f7", fontFamily: "'Outfit',sans-serif", textDecoration: "none", fontWeight: 500 }}>
                Create your first agent →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                    background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#c4b5fd",
                  }}>
                    {msg.conversation?.agent?.name?.[0]?.toUpperCase() ?? "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 11, color: "#a855f7", fontWeight: 600, marginBottom: 2, fontFamily: "'Outfit',sans-serif" }}>
                      {msg.conversation?.agent?.name}
                    </p>
                    <p style={{ fontSize: 13, color: "#a1a1aa", fontFamily: "'Outfit',sans-serif" }} className="truncate">
                      {msg.content}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: "#3f3f46", flexShrink: 0, fontFamily: "'Outfit',sans-serif" }}>
                    {new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp(0.33)} className="rounded-2xl" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: 20,
        }}>
          <h2 className="flex items-center gap-2 mb-4" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={12} color="#a855f7" strokeWidth={1.8} />
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/dashboard/agents/new", label: "New Agent",  Icon: Bot,           desc: "Create a specialist"   },
              { href: "/dashboard/team",        label: "Team Chat",  Icon: MessageSquare, desc: "Talk to your team"    },
              { href: "/dashboard/tasks",        label: "Add Task",   Icon: ClipboardList, desc: "Assign work to agents"},
              { href: "/dashboard/settings",     label: "Settings",   Icon: Settings,      desc: "Configure account"   },
            ].map((action, i) => (
              <motion.div key={action.href} whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}>
                <Link
                  href={action.href}
                  className="block p-4 rounded-xl transition-all duration-200 group"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)"; e.currentTarget.style.background = "rgba(124,58,237,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, marginBottom: 10,
                    background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <action.Icon size={14} color="#a855f7" strokeWidth={1.8} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", fontFamily: "'Outfit',sans-serif", marginBottom: 3 }}>
                    {action.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif" }}>{action.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tasks preview */}
      {tasks.length > 0 && (
        <motion.div {...fadeUp(0.38)} className="rounded-2xl" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: 20,
        }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ClipboardList size={12} color="#a855f7" strokeWidth={1.8} />
              </div>
              Recent Tasks
            </h2>
            <Link href="/dashboard/tasks" style={{ fontSize: 12, color: "#a855f7", textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: task.status === "done" ? "#22c55e" : task.status === "in-progress" ? "#a855f7" : "#3f3f46",
                  boxShadow: task.status === "done" ? "0 0 5px #22c55e" : task.status === "in-progress" ? "0 0 5px #a855f7" : "none",
                }} />
                <span style={{ fontSize: 13, color: "#f4f4f5", flex: 1, fontFamily: "'Outfit',sans-serif" }}>{task.title}</span>
                {task.agent && (
                  <span style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif" }}>{task.agent.name}</span>
                )}
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 999, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                  background: task.priority === "high" ? "rgba(239,68,68,0.12)" : task.priority === "medium" ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.04)",
                  color: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f97316" : "#71717a",
                }}>
                  {task.priority}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
