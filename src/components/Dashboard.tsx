import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Flame,
  Award,
  Zap,
  CheckCircle,
  TrendingUp,
  BookMarked,
  FileText,
  Play,
  Bookmark,
  Trash2,
  ListFilter,
  Plus,
  BookOpen,
  HelpCircle,
  Trophy,
  Users,
  Compass,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface DashboardProps {
  user: any;
  onNavigate: (view: string) => void;
  onStartInterview: (config: any) => void;
  onViewPastReport?: (pastReport: any) => void;
}

export default function Dashboard({ user, onNavigate, onStartInterview, onViewPastReport }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "bookmarks" | "notes">("overview");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<any>({
    id: "dc-1",
    title: "SQL Index Tuning",
    category: "DBMS",
    difficulty: "Medium",
    xpReward: 50,
    isCompleted: false,
    question: "How do composite indexes work in SQL? Explain the Leftmost Prefix rule with a dynamic query example."
  });
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
    fetchNotes();
    fetchRecentInterviews();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentInterviews = async () => {
    try {
      const res = await fetch("/api/interviews");
      if (res.ok) {
        const data = await res.json();
        setRecentInterviews(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newNoteTitle, content: newNoteContent })
      });
      if (res.ok) {
        setNewNoteTitle("");
        setNewNoteContent("");
        setShowNoteForm(false);
        fetchNotes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) fetchNotes();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      if (res.ok) fetchBookmarks();
    } catch (e) {
      console.error(e);
    }
  };

  const submitChallenge = () => {
    if (!challengeAnswer.trim()) return;
    setChallengeFeedback("Submitting answer to placement grader...");
    setTimeout(() => {
      setChallengeFeedback("Challenge completed successfully! Earned +50 XP and extended daily placement streak.");
      setDailyChallenge({ ...dailyChallenge, isCompleted: true });
    }, 1500);
  };

  // Static performance trend data for SVG drawing (Readiness over recent interviews)
  const scoreTrendPoints = [
    { x: 50, y: 150, score: 65, label: "July 1" },
    { x: 150, y: 110, score: 72, label: "July 5" },
    { x: 250, y: 80, score: 79, label: "July 10" },
    { x: 350, y: 50, score: 84, label: "Today" }
  ];

  const svgPath = scoreTrendPoints.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  const leaderboard = [
    { rank: 1, name: "Pranav M.", xp: 1240, readiness: 95, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100" },
    { rank: 2, name: "Aditi Sharma", xp: 980, readiness: 92, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100" },
    { rank: 3, name: "Vansh Agarwal (You)", xp: 450, readiness: 88, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100" },
    { rank: 4, name: "Jessica L.", xp: 420, readiness: 81, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* WELCOME BANNER HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-900 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent rounded-full pointer-events-none" />
        <div className="space-y-1.5 text-left relative z-10">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
              Candidate Suite
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Current streak is hot. Execute mock placement reviews to lock in certifications.
          </p>
        </div>

        <button
          onClick={() => onNavigate("setup")}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] shadow-lg shadow-indigo-600/35 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2.5 transition-all cursor-pointer relative group overflow-hidden"
        >
          <Play className="w-4 h-4 text-white fill-white" />
          <span>Launch AI Interview</span>
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* THREE TABS NAV */}
      <div className="flex space-x-2 border-b border-slate-900 pb-px">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "overview" ? "border-indigo-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "bookmarks" ? "border-indigo-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          Bookmarks ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "notes" ? "border-indigo-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          Notes ({notes.length})
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Streak card */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-3 right-3 p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400/10" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Practice Streak</span>
                <span className="block text-3xl font-black text-white">{user.streak} Days</span>
                <p className="text-[10px] text-amber-500 font-bold uppercase">Ready to increase +50 XP tomorrow</p>
              </div>
            </div>

            {/* Overall Score */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-3 right-3 p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Overall AI Score</span>
                <span className="block text-3xl font-black text-white">{user.overallScore}%</span>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${user.overallScore}%` }} />
                </div>
              </div>
            </div>

            {/* Readiness Index */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-3 right-3 p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-purple-400 fill-purple-400/10" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Interview Readiness %</span>
                <span className="block text-3xl font-black text-white">{user.readiness}%</span>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${user.readiness}%` }} />
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-3 right-3 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Profile Completion</span>
                <span className="block text-3xl font-black text-white">85%</span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase">Add missing certifications (+15%)</p>
              </div>
            </div>
          </div>

          {/* TWO COLUMN CONTENT PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Main Interactive Blocks */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Challenge & Recommended Practice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Daily Challenge Card */}
                <div className="p-6 rounded-2xl border border-slate-900 bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-purple-950/20 text-left relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                      Daily Challenge
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">+{dailyChallenge.xpReward} XP</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {dailyChallenge.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {dailyChallenge.question}
                  </p>
                  <button
                    onClick={() => {
                      if (dailyChallenge.isCompleted) return;
                      setShowChallengeModal(true);
                      setChallengeFeedback(null);
                      setChallengeAnswer("");
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${dailyChallenge.isCompleted ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"}`}
                  >
                    {dailyChallenge.isCompleted ? "Completed" : "Solve Challenge"}
                  </button>
                </div>

                {/* Recommended Practice Pathway */}
                <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left relative overflow-hidden group">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider inline-block mb-4">
                    Recommended Path
                  </span>
                  <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    System Design Interview Core
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Based on your weak areas, revise Deadlocks, Sharding, and Cache Coherency algorithms.
                  </p>
                  <button
                    onClick={() => onNavigate("learning")}
                    className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-gray-200 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    View Materials
                  </button>
                </div>
              </div>

              {/* Performance progression Line Graph */}
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      <span>Placements Progression Graph</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">Readiness progress monitored over your last 4 mock sessions</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    Target: 90% Placed
                  </span>
                </div>

                {/* SVG Graph */}
                <div className="relative h-44 w-full flex items-center justify-center bg-slate-950/40 rounded-xl p-4 overflow-hidden border border-slate-950">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#1e293b" strokeDasharray="3" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="3" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#1e293b" strokeDasharray="3" />

                    {/* Gradient Area */}
                    <path
                      d={`${svgPath} L 350 200 L 50 200 Z`}
                      fill="url(#grad)"
                      opacity="0.15"
                    />

                    {/* Score Trend Path */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="url(#strokeGrad)"
                      strokeWidth="3"
                    />

                    {/* Interactive dots */}
                    {scoreTrendPoints.map((p, i) => (
                      <g key={i}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="6"
                          fill="#6366f1"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={p.x}
                          y={p.y - 12}
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {p.score}%
                        </text>
                        <text
                          x={p.x}
                          y="185"
                          fill="#475569"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {p.label}
                        </text>
                      </g>
                    ))}

                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Weak Topics and Strong Topics Tabs */}
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4">
                <h3 className="text-base font-extrabold text-white">Skill Competency Grids</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Strong Topics */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> High Proficiency Areas
                    </span>
                    <ul className="space-y-2">
                      {[
                        { topic: "Java OOP Principles", score: 92 },
                        { topic: "SQL Query Optimization", score: 89 },
                        { topic: "Communication Fluency", score: 91 },
                        { topic: "Basic Array & String algorithms", score: 86 }
                      ].map((t, idx) => (
                        <li key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                          <span className="text-xs text-gray-300 font-medium">{t.topic}</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{t.score}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weak Topics */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Risk Target Areas
                    </span>
                    <ul className="space-y-2">
                      {[
                        { topic: "Graph Algorithms", risk: "Medium (54%)" },
                        { topic: "Operating Systems (Deadlocks)", risk: "High (45%)" },
                        { topic: "Dynamic Programming", risk: "Medium (58%)" },
                        { topic: "System Design Scalability", risk: "Low (63%)" }
                      ].map((t, idx) => (
                        <li key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                          <span className="text-xs text-gray-300 font-medium">{t.topic}</span>
                          <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">{t.risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recent Interviews Section */}
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                      <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                      <span>Recent Interviews</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">Review detailed reports and certified scores of your past sessions</p>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                    {recentInterviews.length} Sessions
                  </span>
                </div>

                <div className="space-y-3">
                  {recentInterviews.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[8px] font-extrabold uppercase">
                            {item.config?.type || "Technical"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-gray-400 text-[8px] font-extrabold uppercase">
                            {item.config?.company || "Target Company"}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {item.date}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">
                          {item.config?.jobRole || "Software Engineer"} ({item.config?.experience || "Fresher"})
                        </h4>
                        <div className="flex items-center space-x-4 text-[10px] text-gray-400">
                          <span>Difficulty: <strong className="text-gray-300">{item.config?.difficulty || "Medium"}</strong></span>
                          <span>Readiness: <strong className="text-indigo-400">{item.readiness || item.overallScore}%</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-900/60">
                        <div className="text-left sm:text-right">
                          <span className="block text-[8px] text-gray-500 uppercase font-extrabold">Overall Score</span>
                          <span className={`text-sm font-black ${item.overallScore >= 80 ? "text-emerald-400" : item.overallScore >= 70 ? "text-indigo-400" : "text-amber-400"}`}>
                            {item.overallScore}%
                          </span>
                        </div>
                        <button
                          onClick={() => onViewPastReport?.(item)}
                          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <span>View Report</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {recentInterviews.length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-500">
                      No interview history found. Go to 'Interview Prep' to start your first simulation!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Sideboards */}
            <div className="space-y-8">
              {/* Placement Leaderboard */}
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                  <span>Leaderboard</span>
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl flex items-center justify-between border ${item.rank === 3 ? "border-indigo-500 bg-indigo-500/10" : "border-slate-900 bg-slate-950/40"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-extrabold text-gray-500 w-4">{item.rank}</span>
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="block text-xs font-bold text-white">{item.name}</span>
                          <span className="text-[9px] text-gray-500 uppercase">{item.xp} XP Earned</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded">
                        {item.readiness}% Ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <span>Achievements ({(user.achievements || []).length})</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(user.achievements || []).map((ach: any) => (
                    <div
                      key={ach.id}
                      className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/50 hover:border-slate-800 transition-colors flex flex-col items-center text-center space-y-1 relative group"
                    >
                      <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="block text-[8px] font-black text-white truncate w-full">{ach.title}</span>
                      <span className="block text-[7px] text-emerald-400 font-bold uppercase">{ach.unlockedAt}</span>

                      {/* Floating hover description */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2 rounded text-[9px] text-gray-300 w-28 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        {ach.description}
                      </div>
                    </div>
                  ))}
                  {(user.achievements || []).length === 0 && (
                    <div className="col-span-3 text-center py-6 text-xs text-gray-500 font-medium">
                      No achievements unlocked yet. Execute interviews to win medals!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* BOOKMARKS VIEWS */}
      {activeTab === "bookmarks" && (
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-indigo-400" />
                <span>Bookmarked Practice Questions</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">Saved questions for swift placement recap sessions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 hover:border-slate-800 transition-all flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[8px] font-extrabold uppercase">{b.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-gray-400 text-[8px] font-extrabold uppercase">{b.role}</span>
                  </div>
                  <p className="text-xs font-bold text-white pr-2 pt-1">{b.question}</p>
                  <span className="block text-[8px] text-gray-600 font-bold uppercase">Saved {b.savedAt}</span>
                </div>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="p-1.5 rounded-lg border border-slate-900 hover:border-red-500/40 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {bookmarks.length === 0 && (
              <div className="col-span-2 text-center py-12 text-xs text-gray-500">
                Bookmarks folder is empty. During simulations, tap "Bookmark" to collect challenging study notes.
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTES UTILITY */}
      {activeTab === "notes" && (
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Placement Strategy Notes</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">Jot down behavioral formulas, code complexities, or memory tricks</p>
            </div>
            <button
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showNoteForm ? "Close Form" : "New Note"}</span>
            </button>
          </div>

          {showNoteForm && (
            <form onSubmit={addNote} className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Note Title</label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g., Graph BFS Template"
                  className="w-full px-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Note Content</label>
                <textarea
                  required
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="e.g., queue = [root]; visited = set(); while queue: node = queue.pop(0)..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-lg"
              >
                Save Memo
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 hover:border-slate-800 transition-all flex justify-between items-start gap-4">
                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                  <span className="block text-[8px] text-gray-600 font-bold uppercase pt-1">Saved {n.date}</span>
                </div>
                <button
                  onClick={() => deleteNote(n.id)}
                  className="p-1.5 rounded-lg border border-slate-900 hover:border-red-500/40 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="col-span-2 text-center py-12 text-xs text-gray-500">
                Notes list is empty. Keep code snippets or STAR answers for quick reference.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DAILY CHALLENGE DIALOG MODAL */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-900 bg-slate-900 p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <span>Placement Challenge: {dailyChallenge.title}</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900">
              {dailyChallenge.question}
            </p>

            {challengeFeedback && (
              <div className="p-3 text-xs rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                {challengeFeedback}
              </div>
            )}

            {!dailyChallenge.isCompleted && (
              <textarea
                rows={4}
                value={challengeAnswer}
                onChange={(e) => setChallengeAnswer(e.target.value)}
                placeholder="Type your explanation or query block here..."
                className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-indigo-500 resize-none"
              />
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowChallengeModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-gray-400 text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
              {!dailyChallenge.isCompleted && (
                <button
                  type="button"
                  onClick={submitChallenge}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Submit Grader
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
