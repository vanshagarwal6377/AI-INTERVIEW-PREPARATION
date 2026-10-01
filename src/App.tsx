import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Trophy,
  Award,
  BookOpen,
  Compass,
  FileText,
  HelpCircle,
  Play,
  Briefcase,
  Layers,
  Sparkles,
  LogOut,
  ChevronRight,
  Bookmark,
  Bell
} from "lucide-react";

import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import InterviewSetup from "./components/InterviewSetup";
import ActiveInterview from "./components/ActiveInterview";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import LearningHub from "./components/LearningHub";
import AIChatAssistant from "./components/AIChatAssistant";
import ReportDashboard from "./components/ReportDashboard";

import { InterviewConfig, InterviewQuestion } from "./types";

type View =
  | "landing"
  | "auth"
  | "dashboard"
  | "setup"
  | "active-interview"
  | "resume-analyzer"
  | "learning"
  | "ai-assistant"
  | "report";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<any | null>(null);
  const [activeConfig, setActiveConfig] = useState<InterviewConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<InterviewQuestion[]>([]);
  const [preloadedReport, setPreloadedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setView("dashboard");
      } else {
        setUser(null);
        setView("landing");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setView("dashboard");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setView("landing");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLaunchInterview = (config: InterviewConfig) => {
    setActiveConfig(config);
    setView("active-interview");
  };

  const handleInterviewCompleted = (questions: InterviewQuestion[]) => {
    setActiveQuestions(questions);
    setView("report");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-gray-100">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Synchronizing Candidate Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER NAVIGATION BAR (Shown for authenticated views) */}
      {user && view !== "active-interview" && (
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <div
              onClick={() => setView("dashboard")}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight font-sans">
                INTERVIEW.<span className="text-indigo-400">AI</span>
              </span>
            </div>

            {/* Nav Menu Links */}
            <nav className="hidden md:flex items-center space-x-6 text-xs uppercase font-bold tracking-wider">
              <button
                onClick={() => setView("dashboard")}
                className={`transition-colors hover:text-white cursor-pointer ${view === "dashboard" ? "text-white" : "text-gray-400"}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView("setup")}
                className={`transition-colors hover:text-white cursor-pointer ${view === "setup" ? "text-white" : "text-gray-400"}`}
              >
                Interview Prep
              </button>
              <button
                onClick={() => setView("resume-analyzer")}
                className={`transition-colors hover:text-white cursor-pointer ${view === "resume-analyzer" ? "text-white" : "text-gray-400"}`}
              >
                ATS Grader
              </button>
              <button
                onClick={() => setView("learning")}
                className={`transition-colors hover:text-white cursor-pointer ${view === "learning" ? "text-white" : "text-gray-400"}`}
              >
                Learning Hub
              </button>
              <button
                onClick={() => setView("ai-assistant")}
                className={`transition-colors hover:text-white cursor-pointer ${view === "ai-assistant" ? "text-white" : "text-gray-400"}`}
              >
                AI Mentor
              </button>
            </nav>

            {/* Profile / Notifications controls */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg border border-slate-900 bg-slate-950/60 hover:bg-slate-900 text-gray-400 hover:text-white transition-colors relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              </button>

              <div className="flex items-center space-x-3 pl-2 border-l border-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden lg:block text-left">
                  <span className="block text-xs font-bold text-white leading-none">{user.name}</span>
                  <span className="text-[9px] text-gray-500 font-medium">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg border border-slate-900 hover:border-red-500/40 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* MOBILE FLOATING RAIL NAVIGATION */}
      {user && view !== "active-interview" && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/85 backdrop-blur-lg border border-slate-900 rounded-full py-2.5 px-4 flex items-center space-x-4 shadow-2xl">
          {[
            { id: "dashboard", label: "Dashboard", icon: <Layers className="w-4 h-4" /> },
            { id: "setup", label: "Prep", icon: <Play className="w-4 h-4" /> },
            { id: "resume-analyzer", label: "Resume", icon: <FileText className="w-4 h-4" /> },
            { id: "learning", label: "Study", icon: <BookOpen className="w-4 h-4" /> },
            { id: "ai-assistant", label: "Mentor", icon: <HelpCircle className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`p-2 rounded-full transition-all flex flex-col items-center justify-center cursor-pointer ${view === item.id ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}

      {/* MAIN VIEWPORT BODY CONTAINER */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <LandingPage onGetStarted={() => setView("auth")} />
            </motion.div>
          )}

          {view === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AuthPage onAuthSuccess={handleLoginSuccess} onBackToLanding={() => setView("landing")} />
            </motion.div>
          )}

          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard
                user={user}
                onNavigate={(v) => setView(v as View)}
                onStartInterview={(cfg) => {
                  setActiveConfig(cfg);
                  setView("active-interview");
                }}
                onViewPastReport={(report) => {
                  setPreloadedReport(report);
                  setActiveConfig(report.config);
                  setView("report");
                }}
              />
            </motion.div>
          )}

          {view === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <InterviewSetup
                onBack={() => setView("dashboard")}
                onLaunch={handleLaunchInterview}
              />
            </motion.div>
          )}

          {view === "active-interview" && activeConfig && (
            <motion.div
              key="active-interview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveInterview
                config={activeConfig}
                user={user}
                onCompleted={handleInterviewCompleted}
                onExit={() => setView("dashboard")}
              />
            </motion.div>
          )}

          {view === "resume-analyzer" && (
            <motion.div
              key="resume-analyzer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ResumeAnalyzer />
            </motion.div>
          )}

          {view === "learning" && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <LearningHub />
            </motion.div>
          )}

          {view === "ai-assistant" && (
            <motion.div
              key="ai-assistant"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AIChatAssistant />
            </motion.div>
          )}

          {view === "report" && (activeConfig || preloadedReport?.config) && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ReportDashboard
                questions={activeQuestions}
                config={activeConfig || preloadedReport?.config}
                user={user}
                preloadedReport={preloadedReport}
                onNavigate={(v) => {
                  if (v === "dashboard") {
                    setPreloadedReport(null);
                  }
                  setView(v as View);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* COMPACT CLEAN FOOTER */}
      {view !== "active-interview" && (
        <footer className="border-t border-slate-900 py-6 px-6 text-center text-[10px] text-gray-600 uppercase tracking-widest mt-12 pb-24 md:pb-6 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© 2026 INTERVIEW.AI. ALL PLACEMENTS SECURED.</span>
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>AI INTEGRATIONS ONLINE</span>
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
