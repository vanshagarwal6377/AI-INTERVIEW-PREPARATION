import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  Layers,
  HelpCircle,
  TrendingUp,
  Clock,
  Building2,
  Play,
  ArrowLeft,
  ChevronRight,
  Info
} from "lucide-react";
import {
  InterviewConfig,
  JobRole,
  ExperienceLevel,
  InterviewType,
  DifficultyLevel,
  InterviewDuration,
  CompanyName
} from "../types";

interface InterviewSetupProps {
  onBack: () => void;
  onLaunch: (config: InterviewConfig) => void;
}

export default function InterviewSetup({ onBack, onLaunch }: InterviewSetupProps) {
  const [jobRole, setJobRole] = useState<JobRole>("Software Engineer");
  const [experience, setExperience] = useState<ExperienceLevel>("Fresher");
  const [type, setType] = useState<InterviewType>("Technical");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [duration, setDuration] = useState<InterviewDuration>("30 Minutes");
  const [company, setCompany] = useState<CompanyName>("Google");

  const roles: JobRole[] = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "AI Engineer",
    "DevOps Engineer",
    "Cyber Security",
    "Product Manager"
  ];

  const experiences: ExperienceLevel[] = ["Fresher", "1-2 Years", "3-5 Years", "Senior"];

  const types: InterviewType[] = ["Technical", "HR", "Behavioral", "System Design", "Mixed"];

  const difficulties: DifficultyLevel[] = ["Easy", "Medium", "Hard"];

  const durations: InterviewDuration[] = ["10 Minutes", "20 Minutes", "30 Minutes", "45 Minutes", "60 Minutes"];

  const companies: CompanyName[] = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Adobe",
    "Oracle",
    "Netflix",
    "Flipkart",
    "Walmart",
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Cognizant",
    "Capgemini"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunch({
      jobRole,
      experience,
      type,
      difficulty,
      duration,
      company
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>

      {/* Header title */}
      <div className="text-left space-y-1 mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Configure Placement Mock</h1>
        <p className="text-xs sm:text-sm text-gray-400">Specify parameters below to spawn a custom Gemini AI interviewer.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Param Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Target Company selection */}
          <div className="space-y-3">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Target Company / Organization</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {companies.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCompany(c)}
                  className={`py-2 px-3 rounded-lg border text-[11px] font-bold text-center transition-all truncate cursor-pointer ${company === c ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow" : "bg-slate-950/40 border-slate-900 text-gray-400 hover:border-slate-800"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Job Role selection */}
            <div className="space-y-3">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Job Role Selection</span>
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value as JobRole)}
                className="w-full px-4 py-3 rounded-xl border border-slate-900 bg-slate-950/60 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Experience Levels */}
            <div className="space-y-3">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Target Seniority</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {experiences.map((exp) => (
                  <button
                    type="button"
                    key={exp}
                    onClick={() => setExperience(exp)}
                    className={`py-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${experience === exp ? "bg-indigo-600/15 border-indigo-500 text-indigo-300" : "bg-slate-950/40 border-slate-900 text-gray-400 hover:border-slate-800"}`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty tiers */}
            <div className="space-y-3">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Interview Difficulty Tier</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => (
                  <button
                    type="button"
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${difficulty === diff ? "bg-indigo-600/15 border-indigo-500 text-indigo-300" : "bg-slate-950/40 border-slate-900 text-gray-400 hover:border-slate-800"}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interview Types and Time Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-slate-900 pt-8">
          {/* Interview type selections */}
          <div className="space-y-3">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Interview Round / Style</span>
            </label>
            <div className="space-y-2">
              {types.map((ty) => (
                <button
                  type="button"
                  key={ty}
                  onClick={() => setType(ty)}
                  className={`w-full p-4 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${type === ty ? "bg-indigo-600/15 border-indigo-500 text-indigo-300" : "bg-slate-950/40 border-slate-900 text-gray-400 hover:border-slate-800"}`}
                >
                  <div>
                    <span className="block font-bold text-white">{ty} Interview</span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {ty === "Technical" && "DSA coding playground, systems, networks, SQL reviews."}
                      {ty === "HR" && "Culture fits, confidence, soft-skills, company value checks."}
                      {ty === "Behavioral" && "STAR framework checks (Situation, Task, Action, Result)."}
                      {ty === "System Design" && "Architecting scale, CDNs, databases, replication checks."}
                      {ty === "Mixed" && "Comprehensive technical theory, coding problems & values."}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Durations */}
            <div className="space-y-3">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Session Time Limits</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as InterviewDuration)}
                className="w-full px-4 py-3 rounded-xl border border-slate-900 bg-slate-950/60 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Visual warning */}
            <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 flex items-start space-x-3 text-left">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                By launching, you allocate automated audio listeners and a dedicated virtual recruiter. If choosing Technical, keep your code compiles efficient. Check your micro credentials before speaking.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.01] hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>Instantiate Interviewer</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
