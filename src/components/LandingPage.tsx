import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Brain,
  Video,
  Code,
  Sparkles,
  FileText,
  BookOpen,
  ArrowRight,
  Play,
  Award,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Check,
  Star,
  Activity,
  Users
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Video className="w-6 h-6 text-indigo-400" />,
      title: "AI Voice Interviewer",
      description: "Speak directly into your microphone. Our AI interviewer listens, transcribe in real-time, speaks back questions, and dynamically adjusts the tone and difficulty based on your fluency.",
    },
    {
      icon: <Code className="w-6 h-6 text-purple-400" />,
      title: "Full Coding Playground",
      description: "Code directly inside the web browser in JavaScript, Python, C++, Java, or C. Get granular compiler tests, time & space complexity maps, and AI-powered performance reviews.",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      title: "Instant ATS Resume Grader",
      description: "Upload your resume PDF and instantly evaluate it with our professional ATS scoring engine. Uncover missing keyword gaps, skill graphs, and custom corporate suggestions.",
    },
    {
      icon: <Brain className="w-6 h-6 text-pink-400" />,
      title: "Granular AI Evaluation",
      description: "Get evaluated on 12 critical dimensions including technical accuracy, filler words count, logical reasoning, grammar accuracy, speaking speed, and time management.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: "Structured Recovery Study Plan",
      description: "After every interview, the system automatically devises a highly tailored 4-week recovery study syllabus mapping tutorials, roadmaps, and LeetCode problems.",
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Verified Credentials",
      description: "Score above 70% in any simulation and instantly receive a downloadable verified course certificate with unique validation IDs to share on LinkedIn and resume profiles.",
    }
  ];

  const companies = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Adobe", "Oracle", "Netflix", "Flipkart", "Walmart"
  ];

  const stats = [
    { value: "45K+", label: "Mock Interviews Run" },
    { value: "84%", label: "Average Score Gain" },
    { value: "92%", label: "Placed Within 3 Months" },
    { value: "120+", label: "Partner Universities" }
  ];

  const testimonials = [
    {
      quote: "The voice AI interview felt incredibly realistic. The follow-up questions caught me off guard just like in real life, but the instant evaluation helped me ace my actual Google interview!",
      author: "Sneha Nair",
      role: "Placed at Google (SDE-1)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "The coding playground combined with instant complexity analysis was a game-changer. It didn't just tell me my solution was right, it showed me how to optimize it from O(N^2) to O(N).",
      author: "David Chen",
      role: "Placed at Microsoft (Full Stack Developer)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "My resume ATS score was originally 45%. After making the exact keyword and skills adjustments recommended by the platform, I secured 6 callback interviews within a single week!",
      author: "Sarah Jenkins",
      role: "Placed at Apple (Product Manager)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const faqs = [
    {
      q: "How does the voice-based mock interview work?",
      a: "The platform uses high-precision browser Web Speech APIs to capture and transcribe your microphone answers. This transcript is securely evaluated by Gemini AI on the backend, which speaks follow-up questions out loud using native Text-to-Speech voices, creating a fluid verbal dialogue."
    },
    {
      q: "Can I use the coding editor for technical rounds?",
      a: "Absolutely! For developer roles, the system embeds a premium Monaco Editor clone. You can choose Javascript, Python, C++, C, or Java, write code, run against local test cases, and receive space/time complexity feedback along with optimized refactoring answers."
    },
    {
      q: "What does the ATS resume analyzer evaluate?",
      a: "The analyzer scans your resume text for semantic keywords matching modern tech job posts. It evaluates grammatical clarity, layout impact, ATS compliance, skill keywords density, and outputs an exact percentage score along with a checklist of keywords you should add."
    },
    {
      q: "Is there any cost to practice interviews?",
      a: "Our basic tier is 100% free for students and job seekers. We offer premium packages for unlimited multi-speaker voice configurations, elite company-specific question banks, and verified credentials sharing."
    }
  ];

  return (
    <div id="landing-container" className="min-h-screen text-gray-100 bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] right-[5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER HERO NAVBAR */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent tracking-tight">
              INTERVIEW.AI
            </span>
            <span className="block text-[9px] text-indigo-400 font-bold tracking-widest uppercase">PREPARATION PLATFORM</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#statistics" className="hover:text-white transition-colors">Statistics</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <button
          onClick={onGetStarted}
          className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI-POWERED CORPORATE PLACEMENT DRILLS</span>
          </div>

          <h1 className="max-w-4xl mx-auto text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Ace Your Next Corporate Interview with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Generative AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            Simulate realistic technical and HR company interviews. Speak or type answers in real-time, solve live coding puzzles, and receive structured grading rubrics along with a tailored 4-week recovery study syllabus.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3 cursor-pointer"
            >
              <span>Start Free Simulation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-gray-300 hover:text-white font-semibold flex items-center justify-center space-x-3 transition-colors"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
              <span>See Platform Features</span>
            </a>
          </div>
        </motion.div>

        {/* HERO MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/30 p-2.5 backdrop-blur-2xl shadow-2xl shadow-indigo-500/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="absolute inset-0 bg-slate-950/80 rounded-xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-900 flex flex-col aspect-video">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-6 py-1 rounded-md bg-slate-950 text-[10px] font-mono text-gray-400 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span>ACTIVE SIMULATION: GOOGLE SDE INTERVIEW</span>
              </div>
              <div className="w-12" />
            </div>
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/10">
              {/* Left Mock Sidebar */}
              <div className="w-full md:w-1/3 space-y-4 text-left border-r border-slate-900 pr-6">
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Interviewer Speech</span>
                  <p className="text-sm font-semibold text-white">"Welcome! Let's start with a design problem. How would you design a scalable rate limiter for Google APIs?"</p>
                </div>
                <div className="space-y-1 bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Live Audio Transcriber
                  </span>
                  <p className="text-xs italic text-gray-300">"Well... to design a rate limiter, I would probably use a Token Bucket algorithm or a sliding window logs pattern..."</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg text-xs flex justify-between text-gray-400">
                  <span>Filler Words count: 1 ("well")</span>
                  <span>Fluency: 92%</span>
                </div>
              </div>
              {/* Right Mock Code Sandbox */}
              <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border border-slate-800 text-left overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>api_rate_limiter.py</span>
                  <span className="text-indigo-400">Python 3</span>
                </div>
                <div className="flex-1 p-4 font-mono text-xs text-indigo-300 space-y-1.5 overflow-hidden">
                  <p><span className="text-purple-400">import</span> time</p>
                  <p><span className="text-blue-400">class</span> <span className="text-yellow-300">TokenBucketRateLimiter</span>:</p>
                  <p className="pl-4"><span className="text-blue-400">def</span> <span className="text-yellow-300">__init__</span>(self, capacity, leak_rate):</p>
                  <p className="pl-8">self.capacity = capacity</p>
                  <p className="pl-8">self.leak_rate = leak_rate</p>
                  <p className="pl-8">self.tokens = capacity</p>
                  <p className="pl-8">self.last_updated = time.time()</p>
                  <p className="pl-4"><span className="text-blue-400">def</span> <span className="text-yellow-300">allow_request</span>(self):</p>
                  <p className="pl-8 text-gray-500"># Fill the bucket based on elapsed time...</p>
                  <p className="pl-8">now = time.time()</p>
                  <p className="pl-8">self.tokens = min(self.capacity, self.tokens + (now - self.last_updated) * self.leak_rate)</p>
                </div>
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-gray-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> All local test cases passed!
                  </span>
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300">Complexity: O(1) Time</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TRUSTED COMPANIES TICKER */}
      <section className="border-y border-slate-900 bg-slate-950/50 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            SIMULATE TARGET INTERVIEWS FOR GLOBALLY ELITE COMPANIES
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-4 grayscale opacity-40">
            {companies.map((c, i) => (
              <span key={i} className="font-extrabold text-lg text-white hover:text-indigo-400 transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered Specially For Job Placement Success
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            No more rote memorization. Practice with state-of-the-art voice generative modules, instant complexity evaluation systems, and customized learning worksheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-800 transition-all duration-300 backdrop-blur-md group hover:-translate-y-1 flex flex-col space-y-4 text-left"
            >
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 w-fit group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* KEY STATISTICS */}
      <section id="statistics" className="border-t border-slate-900 bg-slate-900/10 py-20 relative">
        <div className="absolute inset-0 bg-indigo-950/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="space-y-1 relative group">
              <span className="block text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {s.value}
              </span>
              <span className="block text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Success Stories From Placed Candidates
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Discover how candidates leveraged AI-driven interview feedback to sharpen their coding patterns, refine behavioral responses, and crack tier-1 placement offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-colors flex flex-col space-y-6 relative"
            >
              <div className="flex space-x-1 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-900">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-indigo-400 font-semibold uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 scroll-mt-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm">Have queries about the voice evaluation engine, code compiler, or subscription plans?</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-900 bg-slate-900/10 overflow-hidden transition-colors hover:border-slate-800"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-semibold text-sm sm:text-base cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activeFaq === idx ? "rotate-180 text-indigo-400" : ""}`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-gray-400 text-xs sm:text-sm leading-relaxed border-t border-slate-950/40 bg-slate-950/25">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20 relative">
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Flexible Plans For Every Preparation Stage
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Select a pricing layout crafted for your preparation journey. Start with our fully fledged free simulation credits, or unlock elite features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <p className="text-xs text-gray-500">Perfect for checking basic skills</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-xs text-gray-500 ml-1">/ forever</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3 Free Mock Interviews / mo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Standard Text-Based Mode</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Basic Coding Playground (JS)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ATS Resume Score Analysis</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="w-full py-3 mt-8 rounded-xl border border-slate-800 hover:bg-slate-900 text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Premium Tier */}
          <div className="p-8 rounded-2xl border-2 border-indigo-500 bg-slate-900/30 shadow-xl shadow-indigo-500/5 relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[9px] font-bold uppercase rounded-bl-xl tracking-wider">
              Most Popular
            </div>
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-white">Premium Prep</h3>
                <p className="text-xs text-indigo-300">Advanced tools for serious placement prep</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-xs text-gray-500 ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-200">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span className="font-semibold text-indigo-200">Unlimited AI Mock Interviews</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-time Voice & Text Modes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Multilingual Speech & Accent Adapt</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Coding compiler (All Langs)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Detailed 12-Dimension AI rubrics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Downloadable Verified Certificates</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="w-full py-3 mt-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs tracking-wide shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-white">University / Corp</h3>
                <p className="text-xs text-gray-500">For colleges & placement cells</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-white">Custom</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dedicated Admin Control panel</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Student progress telemetry graphs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Custom company exam patterns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bulk certificate exports & API integrations</span>
                </li>
              </ul>
            </div>
            <a
              href="mailto:vanshagarwal2709@gmail.com"
              className="w-full py-3 mt-8 rounded-xl border border-slate-800 hover:bg-slate-900 text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center space-x-2"
            >
              Contact Placement Cell
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT INFO AND FORM */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left info */}
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">SUPPORT DESK</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Reach Out To Us Anytime</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Need customized enterprise options or experiencing subscription questions? Drop our support desk a message and receive responses in under 4 hours.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span>support@interviewai.io</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span>San Francisco, California, USA</span>
              </div>
            </div>
          </div>

          {/* Right form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for your message! Our mock support coordinator will reach out to you within 4 hours.");
            }}
            className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-4 text-left"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Message / Query</label>
              <textarea
                required
                rows={4}
                placeholder="How can we assist you with your career placement preparation?"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Dispatch Message
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-12 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <span className="font-extrabold text-sm text-white tracking-widest">INTERVIEW.AI</span>
          </div>
          <p className="text-gray-500 text-xs">
            &copy; 2026 INTERVIEW.AI Prep. All placement rights reserved. Managed globally via Cloud Run.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="mailto:vanshagarwal2709@gmail.com" className="hover:text-white">Contact Developer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
