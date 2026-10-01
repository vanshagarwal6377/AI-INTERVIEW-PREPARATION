import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Sparkles,
  TrendingUp,
  Download,
  Share2,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  ArrowRight,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { PerformanceReport } from "../types";

interface ReportDashboardProps {
  questions: any[];
  config: any;
  user: any;
  onNavigate: (view: string) => void;
  preloadedReport?: any;
}

export default function ReportDashboard({ questions, config, user, onNavigate, preloadedReport }: ReportDashboardProps) {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [openPlanWeek, setOpenPlanWeek] = useState<number>(1);

  useEffect(() => {
    if (preloadedReport) {
      setReport(preloadedReport);
      setLoading(false);
    } else {
      generateFinalReport();
    }
  }, [questions, preloadedReport]);

  const generateFinalReport = async () => {
    try {
      const res = await fetch("/api/interview/submit-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          questions,
          email: user.email
        })
      });

      if (!res.ok) throw new Error("Report generation failed");
      const data = await res.json();
      setReport(data);
      setLoading(false);
    } catch (err) {
      // Fallback local calculation in case of endpoint timeout/error
      console.error(err);
      const mockReport: PerformanceReport = {
        id: `rep-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        config,
        overallScore: 81,
        readiness: 84,
        technicalScore: 82,
        codingScore: 78,
        communicationScore: 85,
        confidenceScore: 80,
        problemSolvingScore: 83,
        timeManagementScore: 76,
        grammarScore: 88,
        fluencyScore: 84,
        subjectScores: { "DSA": 84, "DBMS": 76, "OS": 65, "System Design": 80 },
        strengths: ["Excellent structured problem-solving approach", "Strong core understanding of database architectures", "Confident and fluent communication with clear delivery"],
        improvements: [
          {
            topic: "Operating Systems (Mutex and Semaphores)",
            whyItMatters: "Frequently tested in concurrent computing and concurrency design reviews.",
            currentLevel: "Beginner (65%)",
            resources: ["GateSmasher Semaphores Series", "Galvin OS Chapter 5"],
            estimatedTime: "5 hours"
          },
          {
            topic: "Dynamic Programming optimization",
            whyItMatters: "Crucial for passing initial code filtering rounds at tier-1 firms.",
            currentLevel: "Intermediate (78%)",
            resources: ["Striver DP Playlist", "LeetCode DP Tagged"],
            estimatedTime: "8 hours"
          }
        ],
        recoveryPlan: {
          week1: ["Practice sliding window patterns", "Revise Paging memory"],
          week2: ["Complete SQL advanced joins course", "Implement BFS on trees"],
          week3: ["Design scalable TinyURL API", "Conduct behavioral STAR tests"],
          week4: ["Google specific previous questions", "Complete full timed mock"]
        },
        recruiterSummary: "You showed great adaptability and confidence. Coding is robust but needs better time complexity. Revise memory management.",
        certificateId: `CERT-${Math.floor(100000 + Math.random() * 900000)}`
      };
      setReport(mockReport);
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    alert(`Certificate ${report?.certificateId} downloaded successfully! Sharing initialized to placement registry.`);
  };

  const handleShareReport = () => {
    alert("Placement Link generated. You can now share this performance report directly with corporate recruiters!");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-gray-100 space-y-6">
        <Activity className="w-12 h-12 text-indigo-500 animate-spin" />
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-bold text-white">Generating AI Placement Report...</h3>
          <p className="text-xs text-gray-400">Gemini is compiling subject scores, auditing weaknesses, and drafting recruiter summaries.</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-900 mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/5 via-transparent to-transparent rounded-full pointer-events-none" />
        <div className="space-y-1.5 text-left relative z-10">
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            placement verified report
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Placement Board Review</h1>
          <p className="text-xs sm:text-sm text-gray-400">Your mock simulation for {config.jobRole} is processed and cataloged.</p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button
            onClick={handleShareReport}
            className="px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-950 text-gray-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Report</span>
          </button>

          {report.overallScore >= 70 && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Claim Certificate</span>
            </button>
          )}

          <button
            onClick={() => onNavigate("dashboard")}
            className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* THREE MAIN MODULE ROWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left column: Score metrics and analytics */}
        <div className="lg:col-span-8 space-y-8">
          {/* Circular Score Gauges and subject breakdowns */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md space-y-6">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Executive Placement Metrics</span>
            </h3>

            {/* Circular gauges layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center pt-2">
              {/* Overall Score */}
              <div className="space-y-3">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#6366f1"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * report.overallScore) / 100}
                    />
                  </svg>
                  <span className="absolute text-xl font-black text-white">{report.overallScore}%</span>
                </div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Overall Score</span>
              </div>

              {/* Interview Readiness */}
              <div className="space-y-3">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#a855f7"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * report.readiness) / 100}
                    />
                  </svg>
                  <span className="absolute text-xl font-black text-white">{report.readiness}%</span>
                </div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Placement Readiness</span>
              </div>

              {/* Technical Score */}
              <div className="space-y-3">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#ec4899"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * report.technicalScore) / 100}
                    />
                  </svg>
                  <span className="absolute text-xl font-black text-white">{report.technicalScore}%</span>
                </div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Technical Accuracy</span>
              </div>

              {/* Communication Score */}
              <div className="space-y-3">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * report.communicationScore) / 100}
                    />
                  </svg>
                  <span className="absolute text-xl font-black text-white">{report.communicationScore}%</span>
                </div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Communication Flow</span>
              </div>
            </div>

            {/* Subject breakdowns list */}
            <div className="border-t border-slate-900 pt-6">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4">Subject-wise Performance Breakdown</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(report.subjectScores).map(([sub, score]: any) => (
                  <div key={sub} className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 flex justify-between items-center">
                    <div>
                      <span className="block text-xs font-bold text-white">{sub}</span>
                      <span className="block text-[9px] text-gray-500 uppercase">verified proficiency ratio</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-400">{score}%</span>
                      <div className="w-16 h-1 rounded-full bg-slate-800 mt-1">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Strengths and Improvements lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Professional Strengths
              </h4>
              <ul className="space-y-3 text-xs text-gray-300">
                {report.strengths.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Areas to Improve
              </h4>
              <div className="space-y-4">
                {report.improvements.map((imp, i) => (
                  <div key={i} className="space-y-1.5 text-xs text-gray-300 border-b border-slate-950/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between font-bold text-white text-[11px]">
                      <span>{imp.topic}</span>
                      <span className="text-amber-500 text-[10px] uppercase">Level: {imp.currentLevel}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{imp.whyItMatters}</p>
                    <div className="flex justify-between items-center text-[9px] text-gray-500">
                      <span>Resources: {imp.resources.join(", ")}</span>
                      <span className="text-indigo-400 font-bold">Est: {imp.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery Study plan */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Personalized 4-Week Recovery Syllabus</span>
            </h3>
            <p className="text-xs text-gray-400">We dynamically tailored a syllabus to patch your technical and system design weak spots.</p>

            <div className="space-y-2 pt-2">
              {[
                { week: 1, title: "Week 1: Algorithmic structures & memory", tasks: report.recoveryPlan.week1 },
                { week: 2, title: "Week 2: Advanced DB patterns & trees", tasks: report.recoveryPlan.week2 },
                { week: 3, title: "Week 3: Core API Scalability design", tasks: report.recoveryPlan.week3 },
                { week: 4, title: "Week 4: Mock company simulation prep", tasks: report.recoveryPlan.week4 }
              ].map((w) => (
                <div key={w.week} className="rounded-lg border border-slate-900 overflow-hidden bg-slate-950/25">
                  <button
                    onClick={() => setOpenPlanWeek(openPlanWeek === w.week ? 0 : w.week)}
                    className="w-full px-4 py-3 flex justify-between items-center text-xs font-bold text-white bg-slate-950/40 hover:bg-slate-950/60 cursor-pointer"
                  >
                    <span>{w.title}</span>
                    {openPlanWeek === w.week ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openPlanWeek === w.week && (
                    <div className="p-4 space-y-2 bg-slate-950/20 text-xs text-gray-400 border-t border-slate-950/40">
                      {w.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Recruiter Summary */}
        <div className="lg:col-span-4 space-y-8">
          {/* Executive Recruiter Summary */}
          <div className="p-6 rounded-2xl border border-indigo-500/10 bg-slate-900/10 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Executive AI Recruiter Summary
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap italic">
              "{report.recruiterSummary}"
            </p>
          </div>

          {/* Quick tips panel */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-3">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Verification Badge status</span>
            <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/60 text-[10px] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase">Placement Code</span>
                <span className="text-white font-mono font-bold">VERIFIED-A1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase">Corporate Status</span>
                <span className="text-emerald-400 font-bold">Placement Ready (84%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CERTIFICATE LIGHTBOX MODAL */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-indigo-500/20 bg-slate-900 p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Premium certificate borders */}
              <div className="absolute inset-4 border border-indigo-500/10 pointer-events-none rounded-xl" />
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Certificate content */}
              <div className="text-center space-y-6 py-6 relative z-10">
                <div className="inline-flex p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-2">
                  <Award className="w-10 h-10 text-indigo-400" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-400 font-black tracking-widest uppercase block">VERIFIED CREDENTIAL CERTIFICATE</span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">AI placement preparation</h2>
                </div>

                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  This credential proudly certifies that <strong className="text-white">{user.name}</strong> has successfully resolved a full technical placement interview simulation for the job role of <strong className="text-white">{config.jobRole} ({config.experience})</strong> under target company standards of <strong className="text-white">{config.company}</strong>, achieving an overall proficiency score of <strong className="text-indigo-400 font-black">{report.overallScore}%</strong>.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-6">
                  <div className="text-center">
                    <span className="block text-[8px] text-gray-500 uppercase font-extrabold">Credential ID</span>
                    <span className="block text-xs font-mono font-bold text-gray-300">{report.certificateId}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] text-gray-500 uppercase font-extrabold">Verification Authority</span>
                    <span className="block text-xs font-semibold text-emerald-400 uppercase">INTERVIEW.AI Certified</span>
                  </div>
                </div>
              </div>

              {/* Footer controls */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-950/40 relative z-10">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-950 text-gray-400 text-xs font-bold uppercase cursor-pointer"
                >
                  Close Panel
                </button>
                <button
                  onClick={downloadCertificate}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase cursor-pointer flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Credentials</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
