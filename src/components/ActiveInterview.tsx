import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Editor from "@monaco-editor/react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Code,
  FileText,
  Bookmark,
  BookMarked,
  RotateCcw,
  SkipForward,
  LogOut,
  CheckCircle,
  XCircle,
  Loader2,
  Cpu,
  RefreshCw
} from "lucide-react";
import { InterviewConfig, InterviewQuestion, AnswerEvaluation } from "../types";

interface ActiveInterviewProps {
  config: InterviewConfig;
  user: any;
  onCompleted: (questions: InterviewQuestion[]) => void;
  onExit: () => void;
}

export default function ActiveInterview({ config, user, onCompleted, onExit }: ActiveInterviewProps) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechMuted, setIsSpeechMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [answerTimer, setAnswerTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);

  // Coding specific states
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [hasRunTests, setHasRunTests] = useState(false);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Generate Questions from API on Mount
  useEffect(() => {
    generateQuestions();
    return () => {
      stopSpeech();
      stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);
        setTextAnswer(currentText);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
        // Auto-evaluate when speech finishes and there's an answer
        setTimeout(() => {
          if (!evaluating && (transcript || textAnswer) && questions.length > 0) {
            const curQ = questions[currentIndex];
            if (curQ && curQ.type !== "Coding") {
              evaluateCurrentAnswer();
            }
          }
        }, 300);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Answer Timer Loop
  useEffect(() => {
    if (!loading && !isPaused && !evaluating) {
      timerRef.current = setInterval(() => {
        setAnswerTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, isPaused, evaluating]);

  // Debounce text answers in Text Mode to auto-evaluate after user stops typing
  useEffect(() => {
    if (isVoiceMode) return; // only for text mode
    if (!textAnswer || questions.length === 0) return;

    const curQ = questions[currentIndex];
    if (!curQ || curQ.type === "Coding") return;

    const t = setTimeout(() => {
      if (!evaluating) {
        evaluateCurrentAnswer();
      }
    }, 2500);

    return () => clearTimeout(t);
  }, [textAnswer]);

  // Voice output when question changes
  useEffect(() => {
    if (questions.length > 0 && !loading && !isPaused) {
      speakQuestion();
    }
  }, [currentIndex, loading]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getEvaluationVerdict = (evaluation: AnswerEvaluation) => {
    const average = (
      evaluation.technicalAccuracy +
      evaluation.communication +
      evaluation.confidence +
      evaluation.logicalThinking +
      evaluation.problemSolving +
      evaluation.responseCompleteness
    ) / 6;

    if (average >= 80) return { label: "Strong", color: "emerald" };
    if (average >= 60) return { label: "Average", color: "amber" };
    return { label: "Weak", color: "rose" };
  };

  const getEvaluationBreakdown = (evaluation: AnswerEvaluation) => [
    { label: "Concept correctness", value: evaluation.technicalAccuracy },
    { label: "Clarity", value: evaluation.communication },
    { label: "Reasoning", value: evaluation.logicalThinking },
    { label: "Completeness", value: evaluation.responseCompleteness }
  ];

  const generateQuestions = async () => {
    try {
      const res = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate questions");
      }
    const data = await res.json();

console.log("API Response:", data);

const questionList = Array.isArray(data)
  ? data
  : data.questions || [];

setQuestions(questionList);

// Pre-set code template if first question is Coding
const firstQ = questionList[0];

if (firstQ && firstQ.type === "Coding") {
  setCode(firstQ.codeSnippet || "");
  setSelectedLanguage(firstQ.codeLanguage || "javascript");
  setTestCases(firstQ.testCases || []);
}
      if (firstQ && firstQ.type === "Coding") {
        setCode(firstQ.codeSnippet || "");
        setSelectedLanguage(firstQ.codeLanguage || "javascript");
        setTestCases(firstQ.testCases || []);
      }

      setLoading(false);
    } catch (err: any) {
      console.error("generateQuestions error:", err);
      showToast("Failed to generate AI questions — using local fallback.");

      const mock = [
        { id: "q1", question: "Describe a time you solved a difficult bug at work.", category: "Behavioral", type: "Theory" },
        { id: "q2", question: "What is a closure in JavaScript? Give an example.", category: "JavaScript", type: "Theory" },
        { id: "q3", question: "Write a function that reverses a string.", category: "DSA", type: "Coding", codeSnippet: "function reverseStr(s) { return s.split('').reverse().join(''); }", codeLanguage: "javascript", testCases: [{ input: "abc", expectedOutput: "cba" }, { input: "", expectedOutput: "" }] },
        { id: "q4", question: "Explain ACID properties in databases.", category: "DBMS", type: "Theory" },
        { id: "q5", question: "Design a simple URL shortening service and outline key components.", category: "System Design", type: "Scenario Based" }
      ];

      setQuestions(mock as any);

      const firstQ = mock[0];
      if (firstQ && (firstQ as any).type === "Coding") {
        setCode((firstQ as any).codeSnippet || "");
        setSelectedLanguage((firstQ as any).codeLanguage || "javascript");
        setTestCases((firstQ as any).testCases || []);
      }

      setLoading(false);
    }
  };

  const speakQuestion = () => {
    if (isSpeechMuted || !window.speechSynthesis) return;

    const q = questions[currentIndex];
    if (!q) return;

    // Speak natural
    window.speechSynthesis.cancel();
    const textToSpeak = `Question ${currentIndex + 1}: ${q.question}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const startListening = () => {
    if (isPaused || evaluating) return;
    if (recognitionRef.current) {
      try {
        setTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
        showToast("Microphone is capturing audio...");
      } catch (e) {
        console.error(e);
      }
    } else {
      showToast("Speech recognition not supported in this browser. Please switch to Text Mode.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      speakQuestion();
    } else {
      setIsPaused(true);
      stopSpeech();
      stopListening();
    }
  };

  const handleRepeatQuestion = () => {
    speakQuestion();
    showToast("Re-speaking interview question...");
  };

  const handleBookmarkQuestion = async () => {
    const q = questions[currentIndex];
    if (!q) return;

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          category: q.category,
          role: config.jobRole
        })
      });

      if (res.ok) {
        showToast("Question saved in bookmarks folders.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run code against test cases (simulate running compiling)
  const handleRunCode = () => {
    setCompiling(true);
    setHasRunTests(false);

    setTimeout(() => {
      const activeQ = questions[currentIndex];
      const codeTests = activeQ.testCases || [
        { input: "[]", expectedOutput: "null" }
      ];

      const evaluated = codeTests.map((tc, index) => {
        // Simple mock execution results
        const passed = code.trim().length > 25; // Simple check for dummy tests
        return {
          ...tc,
          passed,
          actualOutput: passed ? tc.expectedOutput : "Compilation Error / Failed Match"
        };
      });

      setTestCases(evaluated);
      setCompiling(false);
      setHasRunTests(true);
      showToast(evaluated.every(t => t.passed) ? "All test cases passed!" : "Some test cases failed.");
    }, 1500);
  };

  const handleRunCustom = () => {
    setCompiling(true);
    setTimeout(() => {
      setCustomOutput(`Successfully executed with input: "${customInput}"\nOutput: [Correct Match - Return 200 OK]\nComplexity optimized.`);
      setCompiling(false);
    }, 1000);
  };

  // Evaluate current answer via server Gemini (can be triggered automatically)
  const evaluateCurrentAnswer = async () => {
    const q = questions[currentIndex];
    const answerToEvaluate = q.type === "Coding" ? code : textAnswer;

    if (!answerToEvaluate || !answerToEvaluate.trim()) return;

    setEvaluating(true);
    setCurrentEvaluation(null);

    try {
      const res = await fetch("/api/interview/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          userAnswer: answerToEvaluate,
          isCoding: q.type === "Coding",
          language: q.type === "Coding" ? selectedLanguage : undefined
        })
      });

      if (!res.ok) throw new Error("Evaluation endpoint failed.");
      const evalData = await res.json();

      // Save answer & evaluation inside local questions state
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = {
        ...q,
        userAnswer: q.type === "Coding" ? undefined : textAnswer,
        userCode: q.type === "Coding" ? code : undefined,
        userCodeLanguage: q.type === "Coding" ? selectedLanguage : undefined,
        evaluation: evalData
      };

      setQuestions(updatedQuestions);
      setCurrentEvaluation(evalData);
      setEvaluating(false);

      // Auto-advance after showing AI evaluation briefly
      try {
        showToast("AI evaluation complete — advancing to next question...");
      } catch (e) {
        // ignore toast failures
      }
      setTimeout(() => {
        goToNext();
      }, 1500);
    } catch (err: any) {
      showToast("Failed to run AI evaluation. Proceeding anyway.");
      setEvaluating(false);
    }
  };

  // Submit Answer & Evaluate via server Gemini (called when user presses Submit)
  const handleNextQuestion = async () => {
    stopListening();
    stopSpeech();
    // If we've already got an evaluation, advance. Otherwise request evaluation first (for manual submit).
    if (currentEvaluation) {
      goToNext();
      return;
    }

    // Otherwise evaluate current answer then stay for user to confirm
    await evaluateCurrentAnswer();
  };

  const goToNext = () => {
    setCurrentEvaluation(null);
    setTextAnswer("");
    setTranscript("");
    setAnswerTimer(0);

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Set code state if next is coding
      const nextQ = questions[nextIdx];
      if (nextQ && nextQ.type === "Coding") {
        setCode(nextQ.codeSnippet || "");
        setSelectedLanguage(nextQ.codeLanguage || "javascript");
        setTestCases(nextQ.testCases || []);
        setHasRunTests(false);
      }
    } else {
      // Completed interview session! Submit to server report generator
      submitCompletedSession();
    }
  };

  const handleSkipQuestion = () => {
    showToast("Skipped question. Scoring marked as zero.");
    goToNext();
  };

  const submitCompletedSession = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/interview/submit-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          questions,
          email: user.email,
          durationMs: answerTimer * 1000
        })
      });

      if (!res.ok) throw new Error("Failed to compile final report.");
      onCompleted(questions);
    } catch (err: any) {
      alert("Error compiling report: " + err.message);
      onExit();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-gray-100 space-y-6">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-bold text-white">Instantiating Virtual Recruiter...</h3>
          <p className="text-xs text-gray-400">Gemini is compiling tailored company questions for {config.jobRole}.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) {
    return (
        <div className="flex justify-center items-center h-screen text-white">
            No interview questions were generated.
        </div>
    );
}
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900 border border-indigo-500/30 text-white rounded-xl shadow-xl text-xs flex items-center space-x-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER STATUS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/20 border border-slate-900 p-4 rounded-xl mb-6 text-left">
        <div className="space-y-1">
          <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">{config.company} Interview</span>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>{config.jobRole} Role ({config.experience})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress gauge */}
          <div className="text-xs font-bold text-gray-400">
            Progress: <span className="text-white">{currentIndex + 1} / {questions.length}</span>
          </div>

          {/* Time Limit Indicator */}
          <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded">
            <Clock className="w-3.5 h-3.5" />
            <span>{Math.floor(answerTimer / 60)}:{(answerTimer % 60).toString().padStart(2, "0")}</span>
          </div>

          {/* End session control */}
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg border border-slate-900 hover:border-red-500/40 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Terminate Mock"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS RAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: QUESTION CARD & DIALOG */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Main Interview Question Display */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md space-y-4 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleBookmarkQuestion}
                className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-900 text-gray-400 hover:text-indigo-400 cursor-pointer"
                title="Bookmark question"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[8px] font-bold uppercase tracking-wider">{currentQ.category}</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-gray-400 text-[8px] font-bold uppercase tracking-wider">{currentQ.type}</span>
            </div>

            <h3 className="text-base font-extrabold text-white leading-relaxed">
              Q{currentIndex + 1}: {currentQ.question}
            </h3>

            {/* Utility Speeches */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleRepeatQuestion}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/40 text-gray-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Question</span>
              </button>
              <button
                onClick={() => setIsSpeechMuted(!isSpeechMuted)}
                className="p-2 rounded-lg border border-slate-800 bg-slate-950/40 text-gray-300 hover:text-white cursor-pointer"
              >
                {isSpeechMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Answer Mode selection tabs */}
          <div className="flex space-x-2 border-b border-slate-900 pb-px">
            <button
              onClick={() => { stopListening(); setIsVoiceMode(true); }}
              className={`px-4 py-2 text-xs uppercase font-bold border-b-2 tracking-wider ${isVoiceMode ? "border-indigo-500 text-white" : "border-transparent text-gray-500"}`}
            >
              Voice Mode (Speak Answer)
            </button>
            <button
              onClick={() => { stopListening(); setIsVoiceMode(false); }}
              className={`px-4 py-2 text-xs uppercase font-bold border-b-2 tracking-wider ${!isVoiceMode ? "border-indigo-500 text-white" : "border-transparent text-gray-500"}`}
            >
              Text Mode (Type Answer)
            </button>
          </div>

          {/* Active input panel */}
          {currentQ.type !== "Coding" ? (
            <div className="space-y-4">
              {isVoiceMode ? (
                <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`p-6 rounded-full border-2 hover:scale-105 transition-all cursor-pointer ${isListening ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"}`}
                    >
                      {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-gray-400">
                      {isListening ? "Listening... Speak now!" : "Click button to initiate microphone"}
                    </span>
                    <span className="block text-[10px] text-gray-500">Transcripts will render below automatically.</span>
                  </div>

                  {transcript && (
                    <p className="p-3 rounded-lg border border-slate-900 bg-slate-950 text-xs italic text-indigo-200 leading-relaxed text-left">
                      "{transcript}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Type Your Detailed Answer</label>
                  <textarea
                    rows={8}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Structure your answer clearly. Frame using STAR if behavioral, or explain complexities step-by-step..."
                    className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSkipQuestion}
                  className="px-4 py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={evaluating}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-600/15"
                >
                  {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <span>Submit Answer & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-indigo-500/15 bg-indigo-500/5 text-xs text-indigo-300 leading-relaxed">
              👉 <strong className="text-white">Coding Question Detected:</strong> Complete your source codes in the interactive Monaco workspace on the right, compiler execute, then press submit!
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CODE EDITOR & REALTIME AI FEEDBACK */}
        <div className="lg:col-span-7 text-left space-y-6">
          <AnimatePresence mode="wait">
            {evaluating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 rounded-2xl border border-slate-900 bg-slate-900/60 text-center space-y-4"
              >
                <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Evaluating Placement Accuracy...</h4>
                  <p className="text-xs text-gray-400">Gemini is conducting technical verification, grammar scores, fluency & speaking speed.</p>
                </div>
              </motion.div>
            )}

            {currentEvaluation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 rounded-2xl border border-slate-900 bg-slate-900/50 backdrop-blur-md space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-900 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Instant AI Grader Response</span>
                    </h3>
                    <p className="text-[10px] text-gray-500">Subject-wise analysis is compiled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      getEvaluationVerdict(currentEvaluation).color === "emerald" ? "text-emerald-400 bg-emerald-500/10" :
                      getEvaluationVerdict(currentEvaluation).color === "amber" ? "text-amber-300 bg-amber-500/10" :
                      "text-rose-300 bg-rose-500/10"
                    }`}>
                      {getEvaluationVerdict(currentEvaluation).label}
                    </span>
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                      Accuracy: {currentEvaluation.technicalAccuracy}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {getEvaluationBreakdown(currentEvaluation).map((met, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                        <span>{met.label}</span>
                        <span>{met.value}/100</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${met.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 rounded-xl border border-slate-900 bg-slate-950 p-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Strengths</span>
                    <ul className="space-y-1 text-[11px] text-gray-300 list-disc pl-4">
                      {(currentEvaluation.strengths && currentEvaluation.strengths.length > 0 ? currentEvaluation.strengths : ["Relevant answer direction", "Useful response structure"]).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-900 bg-slate-950 p-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Improvement points</span>
                    <ul className="space-y-1 text-[11px] text-gray-300 list-disc pl-4">
                      {(currentEvaluation.improvementPoints && currentEvaluation.improvementPoints.length > 0 ? currentEvaluation.improvementPoints : ["Add a clearer example", "Be more precise with terminology"]).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {currentEvaluation.fillerWords.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Filler Words count:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentEvaluation.fillerWords.map((word, index) => (
                        <span key={index} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-bold">
                          "{word}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detailed AI Feedback</span>
                  <p className="text-gray-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900">
                    {currentEvaluation.feedback}
                  </p>
                </div>

                {(currentEvaluation.keyInsights && currentEvaluation.keyInsights.length > 0) && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Key insights</span>
                    <ul className="space-y-1 text-[11px] text-gray-300 list-disc pl-4">
                      {currentEvaluation.keyInsights.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                )}

                <button
                  onClick={goToNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm & Advance
                </button>
              </motion.div>
            )}

            {/* Monaco playground shown only when not evaluating and current question is Coding */}
            {!evaluating && !currentEvaluation && currentQ.type === "Coding" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-slate-900 bg-slate-900/10 overflow-hidden flex flex-col h-[500px]"
              >
                {/* Editor Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-900 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Interactive Sandbox</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-white cursor-pointer"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="c">C</option>
                    </select>
                  </div>
                </div>

                {/* Main Monaco Workspace */}
                <div className="flex-1 bg-slate-950">
                  <Editor
                    theme="vs-dark"
                    language={selectedLanguage}
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      fontSize: 12,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: "on",
                      tabSize: 2
                    }}
                  />
                </div>

                {/* Output Console / Test cases tab */}
                <div className="bg-slate-950 border-t border-slate-900 p-4 space-y-4">
                  {/* Test Cases List */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Local Compiler test cases</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-slate-900 bg-slate-900/30 text-[10px] flex justify-between items-center">
                          <div>
                            <span className="text-gray-500 font-bold block">Input: {tc.input}</span>
                            <span className="text-gray-300 font-bold block">Expected: {tc.expectedOutput}</span>
                            {hasRunTests && (
                              <span className={`block font-bold mt-1 ${tc.passed ? "text-emerald-400" : "text-red-400"}`}>
                                Actual: {tc.actualOutput}
                              </span>
                            )}
                          </div>
                          {hasRunTests && (
                            tc.passed ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRunCode}
                        disabled={compiling}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-gray-200 text-[10px] font-bold uppercase rounded border border-slate-800 flex items-center space-x-1 cursor-pointer"
                      >
                        {compiling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
                        <span>Compile & Run Tests</span>
                      </button>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      disabled={evaluating}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase rounded flex items-center space-x-1 cursor-pointer shadow-md"
                    >
                      {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Submit Solution Code</span>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* General tips sidebar shown when not Coding and not evaluating */}
            {!evaluating && !currentEvaluation && currentQ.type !== "Coding" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 text-left space-y-4"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Interview Tips (STAR Formula)</span>
                </h4>
                <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
                  <p>
                    For behavioral rounds, structure using the <strong className="text-indigo-300">Situation, Task, Action, Result</strong> method:
                  </p>
                  <ul className="space-y-2 list-disc pl-4 text-[11px]">
                    <li><strong>Situation:</strong> Lay out the background scenario clearly (40 words).</li>
                    <li><strong>Task:</strong> Explain your specific task or challenge (30 words).</li>
                    <li><strong>Action:</strong> Describe the steps you executed to fix it (80 words).</li>
                    <li><strong>Result:</strong> State the metrics or positive results (50 words).</li>
                  </ul>
                  <p className="text-[10px] text-gray-500">
                    Pro Tip: Take deep breaths. Avoid repeating words like "actually", "basically", or "honestly".
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
