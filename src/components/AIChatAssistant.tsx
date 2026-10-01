import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  Cpu,
  Bookmark,
  CheckCircle,
  Terminal,
  MessageSquare
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your AI Interview Mentor. Ask me anything about Data Structures, System Design, behavioral patterns (STAR method), SQL indexing, or resume tuning. How can I help you excel today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setSending(true);

    try {
      const res = await fetch("/api/chat/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error("Assistant response failed.");
      const data = await res.json();

      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I apologize, but I encountered an error communicating with the AI service. Please verify your Gemini API key inside the Secrets panel."
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const loadPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* Header title */}
      <div className="text-left space-y-1 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-indigo-400" />
          <span>AI Placement Mentor</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">Ask theoretical coding riddles, behavior strategy questions, or request live mock questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left column: chat console */}
        <div className="lg:col-span-8 flex flex-col h-[520px] rounded-2xl border border-slate-900 bg-slate-900/10 overflow-hidden relative">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-slate-900 bg-slate-950 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Realtime Mentor Stream</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-900 border border-slate-900 text-gray-200 rounded-tl-none whitespace-pre-wrap"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="p-3 bg-slate-900 border border-slate-900 text-xs rounded-2xl rounded-tl-none text-gray-400 flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>AI Mentor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-900 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about B-Trees, deadlocks, STAR behavioral questions..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right column: prompt suggestions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> Suggested Prompts
            </h3>

            <div className="space-y-2">
              {[
                { title: "Explain Banker's Algorithm", text: "Explain the OS Banker's Algorithm step-by-step with safety calculations" },
                { title: "STAR behavioral sample", text: "Explain a perfect behavioral response following the STAR framework for handling missing project deadlines" },
                { title: "B-Trees vs B+ Trees", text: "What is the structural difference between B-Trees and B+ Trees in database indexing?" },
                { title: "Generate Dynamic DP question", text: "Generate a dynamic programming interview question with optimal space complexity suggestions" }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPrompt(p.text)}
                  className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-950 transition-all text-xs text-left font-medium text-gray-300 block leading-tight cursor-pointer"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Quick study metrics */}
          <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Coaching Credentials</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Our AI Placement Mentor has digested over 5,000 corporate DSA worksheets, system scalability guides, and behavioral STAR interviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
