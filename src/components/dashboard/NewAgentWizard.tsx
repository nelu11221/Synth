"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { HoverButton } from "@/components/ui/hover-button";
import { Check, Sparkles } from "lucide-react";

const MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku", desc: "Fast & efficient. Best for simple tasks and high volume.", cost: "$" },
  { id: "claude-sonnet-4-5", label: "Claude Sonnet", desc: "Balanced performance. Great for most professional tasks.", cost: "$$" },
  { id: "claude-opus-4-5", label: "Claude Opus", desc: "Most capable. Best for complex reasoning and strategy.", cost: "$$$" },
];

const LANGUAGES = ["English", "Romanian", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Chinese", "Arabic"];

const EMOJIS = ["🤖", "🧠", "💡", "⚡", "🎯", "🔧", "📊", "✍️", "🎨", "🔍", "📈", "🌐", "🛡️", "🚀", "💻", "📱", "🎵", "📚", "🏆", "💼"];

const COLORS = ["#7c3aed", "#a855f7", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316", "#14b8a6"];

interface FormData {
  name: string;
  emoji: string;
  color: string;
  domain: string;
  description: string;
  skills: string[];
  model: string;
  personality: string;
  tone: number;
  language: string;
}

export function NewAgentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState<{ role: string; content: string }[]>([]);
  const [previewInput, setPreviewInput] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    emoji: "🤖",
    color: "#7c3aed",
    domain: "",
    description: "",
    skills: [],
    model: "claude-sonnet-4-5",
    personality: "",
    tone: 5,
    language: "English",
  });

  function update(key: keyof FormData, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSkill(e: React.KeyboardEvent) {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        update("skills", [...form.skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    update("skills", form.skills.filter((s) => s !== skill));
  }

  async function handlePreviewChat() {
    if (!previewInput.trim()) return;
    setPreviewLoading(true);
    const userMsg = previewInput;
    setPreviewInput("");
    setPreviewMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    const systemPrompt = `You are ${form.name || "an AI agent"}, specialized in ${form.domain || "general tasks"}.
Description: ${form.description}
Skills: ${form.skills.join(", ")}
Personality: ${form.personality || "Professional and helpful"}
Tone: ${form.tone}/10 (1=very formal, 10=very casual)
Language: ${form.language}
Always respond in character.`;

    try {
      const res = await fetch("/api/preview-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, systemPrompt, model: form.model }),
      });
      const data = await res.json();
      setPreviewMessages((prev) => [...prev, { role: "assistant", content: data.content || "No response" }]);
    } catch {
      setPreviewMessages((prev) => [...prev, { role: "assistant", content: "Configure your Anthropic API key in Settings to test agents." }]);
    }
    setPreviewLoading(false);
  }

  async function handleCreate() {
    setLoading(true);
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const agent = await res.json();
      router.push(`/dashboard/agents/${agent.id}`);
    } else {
      setLoading(false);
    }
  }

  const steps = ["Identity", "Brain", "Preview"];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-geist text-2xl font-bold text-white">Create New Agent</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">Configure your specialized AI agent</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i <= step && setStep(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
              style={
                i === step
                  ? { color: "#a855f7" }
                  : i < step
                  ? { color: "#22c55e" }
                  : { color: "#71717a" }
              }
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i === step ? "rgba(168,85,247,0.2)" : i < step ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === step ? "#a855f7" : i < step ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
                  color: i === step ? "#a855f7" : i < step ? "#22c55e" : "#71717a",
                }}
              >
                {i < step ? <Check size={11} strokeWidth={2.5} /> : i + 1}
              </div>
              {s}
            </button>
            {i < steps.length - 1 && <div className="w-12 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Identity */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6 space-y-6"
          >
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Agent Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="e.g. Marketing Manager, Data Analyst..."
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Emoji Avatar</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => update("emoji", emoji)}
                    className="w-10 h-10 rounded-xl text-xl transition-all duration-200 hover:scale-110"
                    style={{
                      background: form.emoji === emoji ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${form.emoji === emoji ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => update("color", color)}
                    className="w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      background: color,
                      border: form.color === color ? "2px solid white" : "2px solid transparent",
                      boxShadow: form.color === color ? `0 0 10px ${color}80` : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            {form.name && (
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: `${form.color}11`, border: `1px solid ${form.color}33` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${form.color}22` }}>
                  {form.emoji}
                </div>
                <div>
                  <p className="font-semibold text-white">{form.name}</p>
                  <p className="text-xs" style={{ color: form.color }}>Your AI Agent</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Brain */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6 space-y-6"
          >
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1.5">Domain / Specialty *</label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => update("domain", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="e.g. Social Media Management, Financial Analysis, Legal Research..."
              />
              <p className="text-xs text-[#71717a] mt-1">Be specific — this defines what your agent is an expert in</p>
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="Describe what this agent does and how it helps you..."
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1.5">Key Skills (press Enter to add)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#a855f7", border: "1px solid rgba(124,58,237,0.3)" }}
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="e.g. Python, SEO, Contract Law, Data Visualization..."
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">AI Model</label>
              <div className="space-y-2">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => update("model", m.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200"
                    style={
                      form.model === m.id
                        ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }
                    }
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: form.model === m.id ? "#a855f7" : "#71717a" }}
                    >
                      {form.model === m.id && <div className="w-2 h-2 rounded-full bg-[#a855f7]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{m.label}</span>
                        <span className="text-xs text-[#71717a]">{m.cost}</span>
                      </div>
                      <p className="text-xs text-[#a1a1aa]">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1.5">Personality</label>
              <textarea
                value={form.personality}
                onChange={(e) => update("personality", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="e.g. Analytical, detail-oriented, asks clarifying questions before acting..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[#a1a1aa]">Tone</label>
                <div className="flex gap-3 text-xs text-[#71717a]">
                  <span>Formal</span>
                  <span className="text-[#a855f7] font-medium">{form.tone}/10</span>
                  <span>Casual</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={form.tone}
                onChange={(e) => update("tone", parseInt(e.target.value))}
                className="w-full accent-[#7c3aed]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-1.5">Language</label>
              <select
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
                style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Agent summary */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-geist font-semibold text-white mb-4">Agent Summary</h3>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${form.color}22`, border: `1px solid ${form.color}44` }}
                >
                  {form.emoji}
                </div>
                <div>
                  <h4 className="font-geist font-bold text-white text-lg">{form.name}</h4>
                  <p className="text-[#a1a1aa] text-sm">{form.domain}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${form.color}22`, color: form.color }}>
                      {MODELS.find((m) => m.id === form.model)?.label}
                    </span>
                    <span className="text-xs text-[#71717a]">{form.language}</span>
                  </div>
                </div>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#a1a1aa]">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Live chat preview */}
            <div className="glass rounded-2xl overflow-hidden">
              <div
                className="px-5 py-4 border-b border-white/5 flex items-center gap-3"
                style={{ background: `${form.color}11` }}
              >
                <span className="text-xl">{form.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{form.name || "Your Agent"}</p>
                  <p className="text-xs text-[#a1a1aa]">Live preview</p>
                </div>
              </div>

              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {previewMessages.length === 0 && (
                  <p className="text-xs text-[#71717a] text-center py-8">
                    Test your agent below. Requires an API key in Settings.
                  </p>
                )}
                {previewMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <span className="text-lg mr-2 self-end">{form.emoji}</span>
                    )}
                    <div
                      className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                      style={
                        msg.role === "user"
                          ? { background: "rgba(124,58,237,0.25)", color: "white" }
                          : { background: "rgba(255,255,255,0.05)", color: "#e4e4e7" }
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {previewLoading && (
                  <div className="flex justify-start">
                    <span className="text-lg mr-2">{form.emoji}</span>
                    <div className="px-4 py-3 rounded-2xl bg-white/5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"
                            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePreviewChat()}
                  className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Test your agent..."
                />
                <HoverButton
                  onClick={handlePreviewChat}
                  disabled={previewLoading}
                  className="px-4 py-2.5 bg-violet-600 text-white text-sm font-medium"
                >
                  →
                </HoverButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <HoverButton
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="px-5 py-2.5 bg-transparent text-white text-sm font-medium"
        >
          ← Back
        </HoverButton>

        {step < 2 ? (
          <HoverButton
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 ? !form.name : step === 1 ? !form.domain : false}
            className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold"
          >
            Continue →
          </HoverButton>
        ) : (
          <HoverButton
            onClick={handleCreate}
            disabled={loading}
            className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold"
          >
            {loading ? "Creating..." : <><Sparkles size={13} strokeWidth={2} style={{ marginRight: 6 }} />Create Agent</>}
          </HoverButton>
        )}
      </div>
    </div>
  );
}
