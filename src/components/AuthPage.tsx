import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Mail, Lock, User, Sparkles, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  onBackToLanding: () => void;
}

type AuthMode = "login" | "register" | "forgot" | "verify";

export default function AuthPage({ onAuthSuccess, onBackToLanding }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetFormState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetFormState();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      onAuthSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetFormState();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccessMsg(data.message);
      // Auto switch to verification screen
      setMode("verify");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetFormState();

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setSuccessMsg(data.message);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetFormState();

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccessMsg(data.message);
      setTimeout(() => {
        setMode("login");
        resetFormState();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    resetFormState();

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Vansh Agarwal",
          email: "vanshagarwal2709@gmail.com"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Google Auth failed");
      }

      onAuthSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Floating Header */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 mb-3">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">INTERVIEW.AI</h2>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Placement Simulation System</p>
        </div>

        {/* Auth Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl border border-slate-900 bg-slate-900/40 backdrop-blur-xl shadow-2xl relative"
        >
          {/* Top subtle horizontal highlight bar */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-left space-y-1">
                  <h3 className="text-lg font-bold text-white">Welcome Back</h3>
                  <p className="text-xs text-gray-400">Log in to your placement prep suite.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vanshagarwal2709@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Password</label>
                      <button
                        type="button"
                        onClick={() => { resetFormState(); setMode("forgot"); }}
                        className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Access Dashboard</span>}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800" />
                  <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">or continue with</span>
                  <div className="flex-grow border-t border-slate-800" />
                </div>

                {/* Social Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl border border-slate-800 bg-slate-950/30 hover:bg-slate-950 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.742-.079-1.3-.176-1.854H12.24z"
                    />
                  </svg>
                  <span>Quick Sign in with Google</span>
                </button>

                <p className="text-xs text-gray-400 text-center">
                  New to the platform?{" "}
                  <button
                    type="button"
                    onClick={() => { resetFormState(); setMode("register"); }}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </p>
              </motion.div>
            )}

            {mode === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-left space-y-1">
                  <h3 className="text-lg font-bold text-white">Register Profile</h3>
                  <p className="text-xs text-gray-400">Join 15,000+ candidates preparing for placements.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Vansh Agarwal"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vanshagarwal2709@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Set Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { resetFormState(); setMode("login"); }}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </motion.div>
            )}

            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-left space-y-1">
                  <h3 className="text-lg font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-gray-400">Enter email to recover access to your credentials.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs text-left flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vanshagarwal2709@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Dispatch Reset Link</span>}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center">
                  <button
                    type="button"
                    onClick={() => { resetFormState(); setMode("login"); }}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              </motion.div>
            )}

            {mode === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-left space-y-1">
                  <h3 className="text-lg font-bold text-white">Email Verification</h3>
                  <p className="text-xs text-gray-400">Complete verification to unlock full placement simulations.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-left">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs text-left flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} className="space-y-4 text-left">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We've simulated sending a verification token to <strong className="text-gray-200">{email}</strong>. Click below to verify instantly.
                  </p>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify Email Instantly</span>}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center">
                  <button
                    type="button"
                    onClick={() => { resetFormState(); setMode("login"); }}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Skip & Sign In Now
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic footer tip */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>PRO TIP: Google credentials can bypass verification steps automatically.</span>
        </div>
      </div>
    </div>
  );
}
