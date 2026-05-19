"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, Send, CheckCircle, Loader, AlertCircle, Plus } from "lucide-react";

/* ── Types ── */
interface Agent { id: string; name: string; emoji: string; }

interface ConversationTurn { role: "user" | "assistant"; content: string; }

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  deadline?: string | Date | null;
  agentId?: string | null;
  agent?: Agent | null;
  result?: string | null;
  conversation?: ConversationTurn[] | null;
  executedAt?: string | Date | null;
  errorMessage?: string | null;
}

const COLUMNS = [
  { id: "todo",        label: "To Do",       color: "#71717a" },
  { id: "in-progress", label: "In Progress",  color: "#a855f7" },
  { id: "done",        label: "Done",         color: "#22c55e" },
  { id: "failed",      label: "Failed",       color: "#ef4444" },
];

const PRIORITIES = ["low", "medium", "high"];
const EASE: [number,number,number,number] = [0.16,1,0.3,1];

/* ── Task Result Modal ── */
function TaskResultModal({ task, onClose, onConversationUpdate }: {
  task: Task;
  onClose: () => void;
  onConversationUpdate: (id: string, conversation: ConversationTurn[]) => void;
}) {
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>(task.conversation || []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversation]);

  async function sendFollowUp() {
    if (!question.trim() || sending) return;
    const q = question.trim();
    setQuestion("");
    setSending(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (res.ok) {
        setConversation(data.conversation);
        onConversationUpdate(task.id, data.conversation);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      style={{ backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="relative w-full max-w-2xl mx-4 flex flex-col"
        style={{
          background: "#0d0d10",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              {task.agent && (
                <div style={{
                  width: 36, height: 36, borderRadius: 10, fontSize: 18,
                  background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {task.agent.emoji}
                </div>
              )}
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#a855f7", fontFamily: "'Outfit',sans-serif", margin: 0 }}>
                  {task.agent?.name || "Agent"} completed this task
                </p>
                <p style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif", margin: 0 }}>
                  {task.executedAt ? (() => {
                    const d = new Date(task.executedAt!);
                    const day   = String(d.getDate()).padStart(2, "0");
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const year  = d.getFullYear();
                    const hh    = String(d.getHours()).padStart(2, "0");
                    const mm    = String(d.getMinutes()).padStart(2, "0");
                    return `${day}.${month}.${year} ${hh}:${mm}`;
                  })() : ""}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: 4, borderRadius: 8 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#52525b"; e.currentTarget.style.background = "none"; }}
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 12, color: "#71717a", fontFamily: "'Outfit',sans-serif", margin: "0 0 2px" }}>Task</p>
            <p style={{ fontSize: 14, color: "#f4f4f5", fontFamily: "'Outfit',sans-serif", margin: 0, fontWeight: 600 }}>{task.title}</p>
          </div>
        </div>

        {/* Result + conversation scroll area */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px", minHeight: 0 }}>
          {/* Result */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>
              Result
            </p>
            <div
              className="prose prose-invert prose-sm max-w-none"
              style={{ color: "#d4d4d8", lineHeight: 1.7, fontFamily: "'Outfit',sans-serif", fontSize: 14 }}
            >
              <ReactMarkdown>{task.result || ""}</ReactMarkdown>
            </div>
          </div>

          {/* Conversation thread */}
          {conversation.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
              <p style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>
                Follow-ups
              </p>
              <div className="space-y-4">
                {conversation.map((turn, i) => (
                  <div key={i} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div style={{
                      maxWidth: "80%", padding: "10px 14px",
                      borderRadius: turn.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: turn.role === "user" ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${turn.role === "user" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}`,
                      fontSize: 13, lineHeight: 1.6, fontFamily: "'Outfit',sans-serif",
                      color: turn.role === "user" ? "#ede9fe" : "#d4d4d8",
                    }}>
                      {turn.role === "assistant"
                        ? <div className="prose prose-invert prose-xs max-w-none" style={{ fontSize: 13 }}><ReactMarkdown>{turn.content}</ReactMarkdown></div>
                        : turn.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Follow-up input */}
        <div style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>
            Ask a follow-up
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendFollowUp(); }}
              placeholder={`Ask ${task.agent?.name || "the agent"} anything about this task...`}
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
                fontFamily: "'Outfit',sans-serif",
              }}
              disabled={sending}
            />
            <button
              onClick={sendFollowUp}
              disabled={!question.trim() || sending}
              style={{
                padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                background: !question.trim() || sending ? "rgba(124,58,237,0.2)" : "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: !question.trim() || sending ? "#52525b" : "#fff",
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
                transition: "all 0.2s",
              }}
            >
              {sending ? <Loader size={14} strokeWidth={2} className="animate-spin" /> : <Send size={14} strokeWidth={2} />}
              {sending ? "..." : "Ask"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Task Card ── */
function TaskCard({ task, onStatusChange, onDelete, onOpen, onRetry }: {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onOpen: (task: Task) => void;
  onRetry: (id: string) => void;
}) {
  const isExecuting = task.status === "in-progress";
  const isDone = task.status === "done";
  const isFailed = task.status === "failed";
  const hasResult = isDone && task.result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      className="group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${isExecuting ? "rgba(168,85,247,0.3)" : isFailed ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: 14,
        cursor: hasResult ? "pointer" : "default",
        boxShadow: isExecuting ? "0 0 12px rgba(168,85,247,0.1)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onClick={() => { if (hasResult) onOpen(task); }}
      whileHover={hasResult ? { borderColor: "rgba(168,85,247,0.3)", transition: { duration: 0.15 } } : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <p style={{ fontSize: 13, color: "#f4f4f5", fontWeight: 600, fontFamily: "'Outfit',sans-serif", flex: 1, lineHeight: 1.4 }}>
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          {isExecuting && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
              <Loader size={13} color="#a855f7" strokeWidth={2} />
            </motion.div>
          )}
          {isDone && (
            <CheckCircle size={13} color="#22c55e" strokeWidth={2} />
          )}
          {isFailed && (
            <AlertCircle size={13} color="#ef4444" strokeWidth={2} />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: 2, borderRadius: 4 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#52525b"; }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>
      </div>

      {task.agent && (
        <div className="flex items-center gap-1.5 mb-2">
          <span style={{ fontSize: 12 }}>{task.agent.emoji}</span>
          <span style={{ fontSize: 11, color: "#71717a", fontFamily: "'Outfit',sans-serif" }}>{task.agent.name}</span>
          {isExecuting && (
            <span style={{ fontSize: 10, color: "#a855f7", fontFamily: "'Outfit',sans-serif", marginLeft: 4 }}>executing...</span>
          )}
          {hasResult && (
            <span style={{ fontSize: 10, color: "#22c55e", fontFamily: "'Outfit',sans-serif", marginLeft: 4 }}>click to view →</span>
          )}
          {isFailed && (
            <>
              <span style={{ fontSize: 10, color: "#ef4444", fontFamily: "'Outfit',sans-serif", marginLeft: 4 }}>failed</span>
              <button
                onClick={(e) => { e.stopPropagation(); onRetry(task.id); }}
                style={{ marginLeft: 4, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "1px 6px", cursor: "pointer", color: "#ef4444", fontSize: 10, fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
              >
                ↺ Retry
              </button>
            </>
          )}
        </div>
      )}

      {isFailed && task.errorMessage && (
        <p style={{ fontSize: 11, color: "#71717a", fontFamily: "'Outfit',sans-serif", marginTop: 4, lineHeight: 1.4, wordBreak: "break-word" }}>
          {task.errorMessage.length > 120 ? task.errorMessage.slice(0, 120) + "…" : task.errorMessage}
        </p>
      )}

      <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
        <span style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
          background: task.priority === "high" ? "rgba(239,68,68,0.12)" : task.priority === "medium" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
          color: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#71717a",
        }}>
          {task.priority}
        </span>
        {task.deadline && (
          <span style={{ fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif" }}>
            {(() => {
              const d = new Date(task.deadline!);
              const day   = String(d.getDate()).padStart(2, "0");
              const month = String(d.getMonth() + 1).padStart(2, "0");
              return `${day}.${month}.${d.getFullYear()}`;
            })()}
          </span>
        )}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="ml-auto text-xs rounded-lg px-2 py-1 outline-none"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", color: "#a1a1aa", fontFamily: "'Outfit',sans-serif", fontSize: 11 }}
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}

/* ── New Task Modal ── */
function NewTaskModal({ agents, onClose, onCreate }: {
  agents: Agent[];
  onClose: () => void;
  onCreate: (task: Partial<Task>) => void;
}) {
  const [title, setTitle] = useState("");
  const [agentId, setAgentId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, agentId: agentId || null, priority, deadline: deadline || null, status: "todo" });
  }

  const fieldStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
    fontFamily: "'Outfit',sans-serif",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      style={{ backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        style={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 16, margin: "0 0 20px" }}>
          New Task
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#71717a", fontFamily: "'Outfit',sans-serif", marginBottom: 6 }}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              style={fieldStyle}
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#71717a", fontFamily: "'Outfit',sans-serif", marginBottom: 6 }}>Assign Agent</label>
              <select value={agentId} onChange={(e) => setAgentId(e.target.value)} style={{ ...fieldStyle, padding: "10px 12px" }}>
                <option value="">No agent</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.emoji} {a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#71717a", fontFamily: "'Outfit',sans-serif", marginBottom: 6 }}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ ...fieldStyle, padding: "10px 12px" }}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "#71717a", fontFamily: "'Outfit',sans-serif", marginBottom: 6 }}>Deadline (optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ ...fieldStyle, colorScheme: "dark" }}
            />
          </div>

          {agentId && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <p style={{ fontSize: 12, color: "#c4b5fd", fontFamily: "'Outfit',sans-serif", margin: 0 }}>
                ⚡ The assigned agent will automatically execute this task after creation.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#a1a1aa", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ── KanbanBoard ── */
export function KanbanBoard({ initialTasks, agents }: { initialTasks: Task[]; agents: Agent[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  /* Poll for in-progress tasks every 3s */
  useEffect(() => {
    const hasExecuting = tasks.some((t) => t.status === "in-progress");
    if (!hasExecuting) return;
    const interval = setInterval(async () => {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const fresh = await res.json() as Task[];
        setTasks(fresh);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [tasks]);

  async function updateStatus(id: string, status: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  async function retryTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "in-progress", errorMessage: null } : t));
    await fetch(`/api/tasks/${id}/execute`, { method: "POST" });
  }

  async function createTask(data: Partial<Task>) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const task = await res.json() as Task;
    setTasks((prev) => [task, ...prev]);
    setShowModal(false);
    /* Optimistically set to in-progress if agent assigned */
    if (task.agentId) {
      setTimeout(() => {
        setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "in-progress" } : t));
      }, 1200);
    }
  }

  function handleConversationUpdate(id: string, conversation: ConversationTurn[]) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, conversation } : t));
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, conversation } : prev);
    }
  }

  const visibleColumns = COLUMNS.filter((col) => col.id !== "failed" || tasks.some((t) => t.status === "failed"));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.04em", margin: 0 }}>Tasks</h1>
          <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, fontFamily: "'Outfit',sans-serif" }}>
            {tasks.length} total · {tasks.filter((t) => t.status === "in-progress").length} executing
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 transition-all duration-200"
          style={{
            padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
            boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <Plus size={14} strokeWidth={2.5} /> New Task
        </button>
      </motion.div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, boxShadow: `0 0 6px ${col.color}` }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", fontFamily: "'Outfit',sans-serif" }}>{col.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#52525b", fontFamily: "'Outfit',sans-serif", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 999 }}>
                  {colTasks.length}
                </span>
              </div>

              <div
                style={{
                  minHeight: 120, borderRadius: 16, padding: 10,
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                <AnimatePresence>
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={updateStatus}
                      onDelete={deleteTask}
                      onOpen={(t) => setSelectedTask(t)}
                      onRetry={retryTask}
                    />
                  ))}
                </AnimatePresence>
                {colTasks.length === 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 60, color: "#3f3f46", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <NewTaskModal agents={agents} onClose={() => setShowModal(false)} onCreate={createTask} />
        )}
        {selectedTask && (
          <TaskResultModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onConversationUpdate={handleConversationUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
