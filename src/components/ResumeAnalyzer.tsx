import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  UploadCloud,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const extractPdfText = async (file: File) => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      text += content.items
        .map((item: any) => (typeof item === "object" && "str" in item ? item.str : ""))
        .join(" ")
        .trim();
      text += "\n\n";
    }

    return text.trim();
  };

  const handleFile = async (file: File) => {
    setDropError(null);
    setLoading(true);
    setReport(null);
    setDroppedFileName(file.name);

    try {
      let extractedText = "";

      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        extractedText = await extractPdfText(file);
      } else if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
        extractedText = await file.text();
      } else {
        throw new Error("Unsupported resume format. Please upload a PDF or plain text file.");
      }

      if (!extractedText.trim()) {
        throw new Error("Could not extract text from the resume file.");
      }

      setResumeText(extractedText);
      await analyzeResume(extractedText);
    } catch (err: any) {
      console.error("Failed to read resume file:", err);
      setDropError(err.message || "Unable to read the resume file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const analyzeResume = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze resume");
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      alert(err.message || "Failed to analyze resume. Ensure your Gemini API Key is configured.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    const sampleText = `Candidate Resume Profile:
Name: Vansh Agarwal
Job Objective: Seeking Software Engineering Roles (SDE-1) at Google/Microsoft.
Education: B.Tech in Computer Science, GPA: 9.1/10
Technical Skills: Java, Python, C++, SQL, React, Node.js, HTML, CSS, Git.
Projects:
1. Mock E-commerce Application using React/Redux and Node Express - built full payment gateways, token authentications.
2. DBMS SQL Index Tuning CLI - optimized query execution by 40%.
Work Experience:
Software Engineering Intern at Placement Corp - designed responsive components, optimized database queries.`;
    setResumeText(sampleText);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeResume(resumeText);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* Header title */}
      <div className="text-left space-y-1 mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Resume ATS Grader</h1>
        <p className="text-xs sm:text-sm text-gray-400">Upload your PDF or paste your raw resume contents to perform real-time ATS optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Drag & Drop Area */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileInput}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center space-y-3 cursor-pointer ${dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}`}
            >
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto" />
              <div className="space-y-1 text-xs">
                <span className="block font-bold text-gray-300">Drag & Drop Resume PDF or TXT</span>
                <span className="block text-[10px] text-gray-500">or click to browse local files</span>
              </div>
            </div>
            {droppedFileName && (
              <div className="text-[10px] text-emerald-300 mt-2">Loaded: {droppedFileName}</div>
            )}
            {dropError && (
              <div className="text-[10px] text-rose-400 mt-2">{dropError}</div>
            )}

            {/* Paste content area */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Paste Resume Content Directly</label>
                <button
                  type="button"
                  onClick={loadSample}
                  className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider hover:underline"
                >
                  Load Sample Resume
                </button>
              </div>
              <textarea
                rows={10}
                required
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, work experience, projects, and career summaries here..."
                className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.01] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <span>Execute ATS Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Audit Report */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 rounded-2xl border border-slate-900 bg-slate-900/10 text-center space-y-4"
              >
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Auditing Resume Semantic Gaps...</h4>
                  <p className="text-xs text-gray-400">Gemini is parsing your skills density, scanning ATS filters, and matching corporate keywords.</p>
                </div>
              </motion.div>
            )}

            {!loading && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-6"
              >
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>ATS Audit Verified Report</span>
                    </h3>
                    <p className="text-[10px] text-gray-500">Your profile matches Software Engineering standards.</p>
                  </div>
                  {/* Circle Score */}
                  <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center flex items-center space-x-2">
                    <span className="text-2xl font-black text-indigo-400">{report.atsScore}%</span>
                    <span className="block text-[9px] text-gray-400 font-extrabold uppercase leading-none">ATS Score</span>
                  </div>
                </div>

                {/* Score progression visual */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Skills Match ratio density</span>
                  <div className="w-full h-2 rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${report.atsScore}%` }} />
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Missing Keywords */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Missing Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {report.missingKeywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-bold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skill Analysis */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Core Proficiencies Identified
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {report.skillAnalysis.map((sk: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grammar suggestions */}
                {report.grammarSuggestions.length > 0 && (
                  <div className="space-y-2 border-t border-slate-900 pt-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Grammatical Impact Polish suggestions</span>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {report.grammarSuggestions.map((sug: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-indigo-400 font-bold mt-0.5">·</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements checklists */}
                <div className="space-y-2 border-t border-slate-900 pt-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Concrete Layout and impact improvements</span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {report.improvements.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prediction summary */}
                <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-950/20 text-xs flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase">Corporate Interview Prediction</span>
                    <p className="text-gray-300 leading-relaxed italic">"{report.interviewPrediction}"</p>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !report && (
              <div className="h-full min-h-[300px] rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-center items-center text-center p-6">
                <FileText className="w-10 h-10 text-gray-600 mb-2" />
                <span className="text-xs font-bold text-gray-400 uppercase">Audit Dashboard is empty</span>
                <span className="text-[10px] text-gray-500 max-w-xs mt-1">Upload files or load samples to trigger corporate keyword optimization.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
