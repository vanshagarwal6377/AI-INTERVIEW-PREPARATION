import express from "express";
import path from "path";
import fs from "fs";
import net from "net";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// DB file path
const DB_FILE = process.env.VERCEL
  ? path.join("/tmp", "database.json")
  : path.join(process.cwd(), "database.json");

// Define basic interface for mock database
interface DBState {
  users: any[];
  interviews: any[];
  bookmarks: any[];
  notes: any[];
}

// Default DB state for instant mock capabilities
const DEFAULT_DB: DBState = {
  users: [
    {
      name: "Demo Candidate",
      email: "demo@example.com",
      password: "demo-password",
      isVerified: true,
      streak: 5,
      overallScore: 84,
      readiness: 88,
      recentInterviewsCount: 3,
      xp: 450,
      achievements: [
        { id: "1", title: "First Step", description: "Completed your first mock interview.", unlockedAt: "2026-07-10", icon: "CheckCircle" },
        { id: "2", title: "Streak Master", description: "Maintained a 5-day practice streak.", unlockedAt: "2026-07-14", icon: "Flame" },
        { id: "3", title: "Perfect Score", description: "Scored above 90% in any category.", unlockedAt: "2026-07-12", icon: "Award" }
      ]
    }
  ],
  interviews: [
    {
      id: "int-101",
      date: "2026-07-12",
      config: {
        jobRole: "Software Engineer",
        experience: "Fresher",
        type: "Technical",
        difficulty: "Medium",
        duration: "30 Minutes",
        company: "Google"
      },
      overallScore: 82,
      readiness: 85,
      technicalScore: 84,
      codingScore: 80,
      communicationScore: 85,
      confidenceScore: 80,
      problemSolvingScore: 82,
      timeManagementScore: 78,
      grammarScore: 88,
      fluencyScore: 84,
      subjectScores: { "DSA": 84, "DBMS": 78, "OS": 72 },
      strengths: ["Strong problem solving approach", "Good understanding of trees and arrays", "Confident communication style"],
      improvements: [
        {
          topic: "Operating Systems (Deadlocks)",
          whyItMatters: "Essential for core computing system design interviews.",
          currentLevel: "Beginner (55%)",
          resources: ["OS Course - Deadlocks", "Galvin OS Book Chapter 7"],
          estimatedTime: "4 hours"
        }
      ],
      recoveryPlan: {
        week1: ["Revise Threading and Deadlocks", "Practice 5 Array problems"],
        week2: ["Graph theory Basics", "Practice SQL Joins"],
        week3: ["Design patterns", "Complete 1 System Design session"],
        week4: ["Google company questions", "Timed Coding Mock"]
      },
      recruiterSummary: "Candidate showed sound logic in DSA. Communication is clear. OS knowledge needs touch up."
    }
  ],
  bookmarks: [
    { id: "b1", question: "Explain the difference between SQL and NoSQL databases.", category: "DBMS", role: "Software Engineer", savedAt: "2026-07-14" },
    { id: "b2", question: "Write a function to detect a cycle in a directed graph.", category: "DSA", role: "Software Engineer", savedAt: "2026-07-13" }
  ],
  notes: [
    { id: "n1", title: "Behavioral Tip: STAR Method", content: "Situation, Task, Action, Result. Keep response under 3 minutes.", date: "2026-07-14" },
    { id: "n2", title: "System Design Framework", content: "1. Scope requirements, 2. Design high-level API, 3. Define DB schema, 4. Scale (Caching, CDN, DB replication).", date: "2026-07-13" }
  ]
};

// Helper to read DB state
function readDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database.json:", err);
  }
  return DEFAULT_DB;
}

// Helper to write DB state
function writeDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database.json:", err);
  }
}

async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const server = net.createServer();
      server.unref();

      server.once("error", (err: NodeJS.ErrnoException) => {
        server.close();
        if (err.code === "EADDRINUSE" || err.code === "EACCES") {
          tryPort(port + 1);
          return;
        }
        reject(err);
      });

      server.listen(port, "0.0.0.0", () => {
        const address = server.address();
        const availablePort = typeof address === "object" && address ? address.port : port;
        server.close(() => resolve(availablePort));
      });
    };

    tryPort(startPort);
  });
}

// Lazy AI client getter to support both Gemini and Groq-compatible keys.
let aiClient: GoogleGenAI | null = null;

function getConfiguredProvider(): "gemini" | "groq" {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === "groq") return "groq";
  if (provider === "gemini") return "gemini";

  const key = (process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "").trim();
  if (key.startsWith("gsk_")) return "groq";

  return "gemini";
}

function getApiKey(): string {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey && groqKey !== "YOUR_GROQ_API_KEY") return groqKey;

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey && geminiKey !== "MY_GEMINI_API_KEY") return geminiKey;

  throw new Error("No AI API key is configured. Set GROQ_API_KEY or GEMINI_API_KEY in your environment.");
}

function getGroqModel(): string {
  return (process.env.GROQ_MODEL || "llama-3.1-8b-instant").trim();
}

function getGeminiModel(): string {
  return (process.env.GEMINI_MODEL || "gemini-2.0-flash").trim();
}

async function generateAIContent(prompt: string, config?: { responseMimeType?: string; responseSchema?: any; systemInstruction?: string }) {
  const provider = getConfiguredProvider();
  const apiKey = getApiKey();

  const runGroq = async () => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getGroqModel(),
        messages: [
          ...(config?.systemInstruction ? [{ role: "system", content: config.systemInstruction }] : []),
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq request failed: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";
    if (!text) throw new Error("Groq returned an empty response.");
    return { text };
  };

  const runGemini = async () => {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }

    const response = await aiClient.models.generateContent({
      model: getGeminiModel(),
      contents: prompt,
      config: {
        ...(config?.systemInstruction ? { systemInstruction: config.systemInstruction } : {}),
        ...(config?.responseMimeType ? { responseMimeType: config.responseMimeType } : {}),
        ...(config?.responseSchema ? { responseSchema: config.responseSchema } : {})
      }
    });

    const text = response.text || "";
    if (!text) throw new Error("Gemini returned an empty response.");
    return { text };
  };

  if (provider === "groq") {
    try {
      return await runGroq();
    } catch (error) {
      const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
      if (hasGeminiKey) {
        console.warn("Groq failed, retrying with Gemini fallback:", (error as Error).message);
        return await runGemini();
      }
      throw error;
    }
  }

  return await runGemini();
}

function getGeminiClient(): {
  models: {
    generateContent: (args: {
      model: string;
      contents: string;
      config?: { responseMimeType?: string; responseSchema?: any; systemInstruction?: string };
    }) => Promise<{ text: string }>;
  };
} {
  return {
    models: {
      generateContent: async ({ contents, config }) => {
        const response = await generateAIContent(contents, config);
        return { text: response.text };
      }
    }
  };
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function buildFallbackEvaluation(question: any, userAnswer: string, isCoding: boolean, language?: string) {
  const questionText = (question?.question || "").toLowerCase();
  const answerText = (userAnswer || "").trim();
  const answerLower = answerText.toLowerCase();
  const words = answerText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillerWords = ["um", "uh", "like", "basically", "actually", "literally", "you know", "so", "kind of"];
  const detectedFillers = fillerWords.filter((word) => answerLower.includes(word));

  const strongConceptSignals = [
    "lexical scope", "outer scope", "parent function", "returned", "captures", "remembers", "closure", "callback",
    "function inside", "reference to", "after the outer function", "memory", "private variable", "higher-order", "state"
  ];
  const weakSignals = [
    "it is a function", "it stores data", "it is useful", "some function", "like a function", "i think"
  ];
  const keywordHits = strongConceptSignals.filter((keyword) => answerLower.includes(keyword)).length;
  const weakHitCount = weakSignals.filter((signal) => answerLower.includes(signal)).length;
  const hasConcreteExample = /(for example|example|such as|=>|return function|inner function|function outer|function inner)/i.test(answerText);
  const hasReasoning = /(because|therefore|this means|that means|as a result|since|when|if|while|so)/i.test(answerText);
  const hasStructure = /[.!?]/.test(answerText);
  const hasShortAnswer = wordCount < 12;
  const isGeneric = wordCount < 20 && keywordHits <= 1;

  let technicalAccuracy = 28;
  technicalAccuracy += Math.min(keywordHits * 18, 36);
  technicalAccuracy += hasConcreteExample ? 18 : 0;
  technicalAccuracy += hasReasoning ? 12 : 0;
  technicalAccuracy += wordCount >= 25 ? 10 : 0;
  technicalAccuracy -= weakHitCount * 12;
  technicalAccuracy -= isGeneric ? 22 : 0;
  technicalAccuracy -= hasShortAnswer ? 15 : 0;
  technicalAccuracy = clamp(technicalAccuracy);

  let communication = 42;
  communication += wordCount >= 25 ? 18 : wordCount >= 15 ? 10 : 4;
  communication += hasReasoning ? 12 : 0;
  communication += hasConcreteExample ? 10 : 0;
  communication -= detectedFillers.length * 6;
  communication -= hasShortAnswer ? 12 : 0;
  communication = clamp(communication);

  let confidence = 40;
  confidence += hasConcreteExample ? 14 : 0;
  confidence += hasReasoning ? 12 : 0;
  confidence += wordCount >= 20 ? 14 : 0;
  confidence -= weakHitCount * 10;
  confidence -= hasShortAnswer ? 12 : 0;
  confidence = clamp(confidence);

  let fluency = 46;
  fluency += wordCount >= 20 ? 18 : 8;
  fluency += hasStructure ? 10 : 0;
  fluency -= detectedFillers.length * 7;
  fluency -= hasShortAnswer ? 10 : 0;
  fluency = clamp(fluency);

  let grammar = 48;
  grammar += wordCount >= 20 ? 16 : 8;
  grammar += hasStructure ? 12 : 0;
  grammar -= detectedFillers.length * 5;
  grammar = clamp(grammar);

  let vocabulary = 38;
  vocabulary += keywordHits * 12;
  vocabulary += hasConcreteExample ? 10 : 0;
  vocabulary -= weakHitCount * 10;
  vocabulary = clamp(vocabulary);

  let logicalThinking = 35;
  logicalThinking += hasReasoning ? 20 : 0;
  logicalThinking += keywordHits * 10;
  logicalThinking += hasConcreteExample ? 12 : 0;
  logicalThinking -= isGeneric ? 20 : 0;
  logicalThinking = clamp(logicalThinking);

  let problemSolving = 33;
  problemSolving += hasReasoning ? 15 : 0;
  problemSolving += hasConcreteExample ? 18 : 0;
  problemSolving += isCoding ? 12 : 0;
  problemSolving -= isGeneric ? 18 : 0;
  problemSolving = clamp(problemSolving);

  let responseCompleteness = 26;
  responseCompleteness += wordCount >= 30 ? 26 : wordCount >= 18 ? 14 : 6;
  responseCompleteness += hasConcreteExample ? 16 : 0;
  responseCompleteness += hasReasoning ? 12 : 0;
  responseCompleteness -= isGeneric ? 18 : 0;
  responseCompleteness = clamp(responseCompleteness);

  const speakingSpeed = clamp(Math.round(wordCount * 1.6), 60, 220);
  const timeManagement = clamp(50 + (wordCount >= 25 ? 20 : 8) + (hasReasoning ? 8 : 0) - (hasShortAnswer ? 20 : 0));

  let feedback = "The answer is too vague or incomplete. Add a precise definition, explain the concept clearly, and include a real example or scenario.";
  let verdict: "Strong" | "Average" | "Weak" = "Average";
  let strengths: string[] = ["Relevant answer direction", "Basic concept awareness"];
  let improvementPoints: string[] = ["Add a clearer example", "Be more specific with technical terms"];
  let keyInsights: string[] = ["The response is understandable but could be more precise."];

  if (technicalAccuracy >= 80 && responseCompleteness >= 75) {
    verdict = "Strong";
    feedback = "Strong answer. It is technically sound, well explained, and backed by a clear example and reasoning.";
    strengths = ["Correct concept explanation", "Good use of technical terms", "Clear explanation flow"];
    improvementPoints = ["Tighten the final takeaway", "Add a little more practical nuance if relevant"];
    keyInsights = ["The concept is explained accurately.", "The answer is specific enough for a strong interview response."];
  } else if (technicalAccuracy >= 60) {
    verdict = "Average";
    feedback = "Good attempt. The answer is mostly correct, but it would be stronger with a more precise explanation and a concrete example.";
    strengths = ["Mostly correct idea", "Clear overall structure"];
    improvementPoints = ["Use more precise terminology", "Support with a concrete example or trade-off explanation"];
    keyInsights = ["The answer is directionally correct.", "It needs more specificity to stand out."];
  } else if (technicalAccuracy < 45) {
    verdict = "Weak";
    feedback = "This answer is too generic or incomplete for an interview. Be more specific about the scope behavior and give a clear example.";
    strengths = ["Basic attempt made"];
    improvementPoints = ["Define the concept precisely", "Explain why it matters", "Use a real-world example"];
    keyInsights = ["The answer lacks clarity.", "It does not demonstrate enough depth or confidence."];
  }

  const fallback = {
    technicalAccuracy,
    communication,
    confidence,
    fluency,
    grammar,
    vocabulary,
    logicalThinking,
    problemSolving,
    responseCompleteness,
    speakingSpeed,
    fillerWords: detectedFillers,
    timeManagement,
    feedback,
    verdict,
    strengths,
    improvementPoints,
    keyInsights
  };

  if (isCoding) {
    return {
      ...fallback,
      codeAnalysis: {
        timeComplexity: questionText.includes("sort") || questionText.includes("array") ? "O(n log n) typical optimized approach" : "Depends on algorithm choice and input size",
        spaceComplexity: questionText.includes("sort") || questionText.includes("array") ? "O(1) auxiliary for in-place approaches, O(n) for extra data structures" : "Depends on data structure usage",
        optimizationSuggestions: "Reduce redundant passes, use the best data structure for the problem, and write a cleaner edge-case strategy.",
        bestSolutionExplanation: "A good solution should explain the core approach, complexity, and why it handles edge cases correctly."
      }
    };
  }

  return fallback;
}

function normalizeStringArray(value: any) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSkillAnalysis(value: any) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).map(([key, val]) => {
      if (typeof val === "string" || typeof val === "number") {
        return `${key}: ${String(val).trim()}`;
      }
      return `${key}`;
    });
  }

  if (typeof value === "string") {
    return normalizeStringArray(value);
  }

  return [];
}

function normalizeInterviewPrediction(value: any) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return "No prediction available.";
}

function normalizeAtsReport(raw: any) {
  const source = raw || {};

  const lookup = (aliases: string[]) => {
    for (const alias of aliases) {
      if (Object.prototype.hasOwnProperty.call(source, alias)) {
        return source[alias];
      }
    }
    return undefined;
  };

  return {
    atsScore: Number(
      lookup(["atsScore", "ATS_Score", "ats_score", "ATSScore", "ATS Score"]) ?? 0
    ),
    missingKeywords: normalizeStringArray(
      lookup([
        "missingKeywords",
        "Missing_Keywords",
        "missing_keywords",
        "MissingKeywords",
        "Missing Keywords"
      ])
    ),
    grammarSuggestions: normalizeStringArray(
      lookup([
        "grammarSuggestions",
        "Grammar_Suggestions",
        "grammar_suggestions",
        "GrammarSuggestions",
        "Grammar Suggestions"
      ])
    ),
    skillAnalysis: normalizeSkillAnalysis(
      lookup([
        "skillAnalysis",
        "Skill_Analysis",
        "skill_analysis",
        "SkillAnalysis",
        "Skill Analysis"
      ])
    ),
    improvements: normalizeStringArray(
      lookup([
        "improvements",
        "Concrete_Improvements",
        "concrete_improvements",
        "ConcreteImprovements",
        "Concrete Improvements"
      ])
    ),
    recommendedSkills: normalizeStringArray(
      lookup([
        "recommendedSkills",
        "Recommended_Skills_To_Learn",
        "recommended_skills_to_learn",
        "RecommendedSkills",
        "Recommended Skills"
      ])
    ),
    interviewPrediction: normalizeInterviewPrediction(
      lookup([
        "interviewPrediction",
        "Job_Interview_Readiness_Prediction",
        "job_interview_readiness_prediction",
        "Job Interview Readiness Prediction",
        "interview_prediction"
      ])
    )
  };
}

// ================= AUTH API ENDPOINTS =================

// Register User
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const db = readDB();
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const newUser = {
    name,
    email,
    password,
    isVerified: false,
    streak: 1,
    overallScore: 0,
    readiness: 30,
    recentInterviewsCount: 0,
    xp: 100,
    achievements: []
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({ message: "Registration successful. Please verify your email.", user: { name: newUser.name, email: newUser.email, isVerified: false } });
});

// Login User
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({
    message: "Login successful.",
    token: `mock-jwt-token-for-${user.email}`,
    user: {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      streak: user.streak,
      overallScore: user.overallScore,
      readiness: user.readiness,
      recentInterviewsCount: user.recentInterviewsCount,
      xp: user.xp,
      achievements: user.achievements
    }
  });
});

// Google Login
app.post("/api/auth/google", (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Google authentication payload incomplete." });
  }

  const db = readDB();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      name,
      email,
      password: `google-oauth-${Math.random().toString(36).substring(7)}`,
      isVerified: true,
      streak: 1,
      overallScore: 0,
      readiness: 40,
      recentInterviewsCount: 0,
      xp: 100,
      achievements: []
    };
    db.users.push(user);
    writeDB(db);
  }

  res.json({
    message: "Google login successful.",
    token: `mock-jwt-token-for-${user.email}`,
    user: {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      streak: user.streak,
      overallScore: user.overallScore,
      readiness: user.readiness,
      recentInterviewsCount: user.recentInterviewsCount,
      xp: user.xp,
      achievements: user.achievements
    }
  });
});

// Mock Email Verification
app.post("/api/auth/verify", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(404).json({ error: "User not found." });

  user.isVerified = true;
  writeDB(db);

  res.json({ message: "Email verification successful!", user: { name: user.name, email: user.email, isVerified: true } });
});

// Mock Forgot Password
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(404).json({ error: "User not registered." });

  res.json({ message: "Password reset link has been dispatched to your email address." });
});

// Fetch Profile
app.get("/api/auth/me", (req, res) => {
  const email = req.query.email as string || "demo@example.com";
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Profile not found." });
  }
  const { password: _password, ...publicUser } = user;
  res.json({ user: publicUser });
});


// ================= BOOKMARKS & NOTES API =================

app.get("/api/bookmarks", (req, res) => {
  const db = readDB();
  res.json(db.bookmarks);
});

app.post("/api/bookmarks", (req, res) => {
  const { question, category, role } = req.body;
  const db = readDB();
  const newItem = {
    id: `b-${Date.now()}`,
    question,
    category: category || "General",
    role: role || "Software Engineer",
    savedAt: new Date().toISOString().split("T")[0]
  };
  db.bookmarks.push(newItem);
  writeDB(db);
  res.json({ message: "Question bookmarked successfully.", bookmark: newItem });
});

app.delete("/api/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.bookmarks = db.bookmarks.filter(b => b.id !== id);
  writeDB(db);
  res.json({ message: "Bookmark removed." });
});

app.get("/api/notes", (req, res) => {
  const db = readDB();
  res.json(db.notes);
});

app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  const db = readDB();
  const newItem = {
    id: `n-${Date.now()}`,
    title,
    content,
    date: new Date().toISOString().split("T")[0]
  };
  db.notes.push(newItem);
  writeDB(db);
  res.json({ message: "Note saved successfully.", note: newItem });
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.notes = db.notes.filter(n => n.id !== id);
  writeDB(db);
  res.json({ message: "Note deleted." });
});

app.get("/api/interviews", (req, res) => {
  const db = readDB();
  res.json(db.interviews || []);
});


// ================= INTERVIEW CONTROLS & AI QUESTIONS =================

app.post("/api/interview/generate-questions", async (req, res) => {
  const { jobRole, experience, type, difficulty, duration, company } = req.body;

  try {
    const prompt = `You are a professional HR, technical, and coding interviewer at ${company}.
Your goal is to conduct an elite interview tailored for a ${jobRole} with ${experience} experience.
The interview difficulty should be ${difficulty}, of duration ${duration}, and the interview type is ${type}.

Generate a set of 5 highly realistic, custom interview questions matching this criteria. Ensure they are a healthy mix based on the type:
- If 'Technical' or 'Mixed' or 'System Design': generate some technical theory, scenario-based system designs, or prediction/debugging questions. Include exactly one 'Coding' question which requires writing code in Monaco editor.
- If 'HR' or 'Behavioral': generate deep, high-quality human resources questions (e.g. Tell me about yourself, leadership conflict, why ${company}, etc.) evaluating personality, confidence, and values.

For standard questions: return normal questions.
For the Coding question (only if the type includes Technical, System Design, or Mixed), provide a coding challenge:
  - Generate clean starter template code in Javascript or Python.
  - Return a list of 2 basic test cases (input, expectedOutput).

Generate this in strict JSON format conforming to the requested schema. Do not include markdown formatting or wrapper blocks outside of valid JSON.`;

    const response = await generateAIContent(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            category: { type: Type.STRING, description: "e.g., DSA, DBMS, OS, React, SQL, HR, System Design" },
            type: {
              type: Type.STRING,
              enum: ["Theory", "Coding", "Scenario Based", "Debugging", "MCQ", "Output Prediction", "Case Study"]
            },
            codeSnippet: { type: Type.STRING, description: "Starter template code if type is Coding, otherwise omitted." },
            codeLanguage: { type: Type.STRING, description: "Recommended programming language for starter code e.g. javascript, python, cpp" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 4 options if type is MCQ, otherwise omitted."
            },
            correctOption: { type: Type.STRING, description: "Correct letter/string if type is MCQ." },
            testCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  input: { type: Type.STRING },
                  expectedOutput: { type: Type.STRING }
                },
                required: ["input", "expectedOutput"]
              },
              description: "Array of 2 test cases if type is Coding."
            }
          },
          required: ["id", "question", "category", "type"]
        }
      }
    });

  const questionsText = response.text;

console.log("AI Response:", questionsText);

let questions = [];

try {
    const parsed = JSON.parse(questionsText);

questions = Array.isArray(parsed)
    ? parsed
    : parsed.interviewQuestions || [];

} catch (err) {
    console.error("JSON Parse Error:", err);
}

if (!Array.isArray(questions) || questions.length === 0) {
    questions = [
        {
            id: "q1",
            question: "Tell me about yourself.",
            category: "HR",
            type: "Theory"
        },
        {
            id: "q2",
            question: "Explain the difference between Stack and Queue.",
            category: "DSA",
            type: "Theory"
        },
        {
            id: "q3",
            question: "Write a function to reverse a string.",
            category: "Programming",
            type: "Coding",
            codeSnippet: "function reverseString(str) {\n    // Write your code here\n}",
            codeLanguage: "javascript",
            testCases: [
                { input: "abc", expectedOutput: "cba" },
                { input: "hello", expectedOutput: "olleh" }
            ]
        }
    ];
}

res.json(questions); 
  } catch (err: any) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: err.message || "Failed to generate interview questions. Ensure your Gemini API Key is configured." });
  }
});


// Evaluate Single Answer
app.post("/api/interview/evaluate-answer", async (req, res) => {
  const { question, userAnswer, isCoding, language } = req.body;

  try {
    const prompt = `You are an elite interviewer evaluating a candidate's response to the following question.
Question: "${question.question}"
Question Category: "${question.category}"
User's Response: "${userAnswer}"
Is Coding question: ${isCoding ? "Yes" : "No"}
Language used: ${language || "N/A"}

Evaluate the user's answer thoroughly across typical corporate scoring categories.
Be strict and realistic: strong answers should score high, weak or generic answers should score lower; do not use the same score for every answer.
Provide score cards from 0 to 100 for each metric, identifying filler words used (such as "um", "ah", "like", "so"), counting time/words speed, and giving constructive feedback.
If it is a Coding question:
  - Conduct full Code Analysis.
  - Perform Time Complexity Analysis.
  - Perform Space Complexity Analysis.
  - Formulate Optimization Suggestions.
  - Give a clear Best Solution Explanation.

Return ONLY valid JSON.

Your entire response must be exactly one valid JSON object and nothing else.`;

    const response = await generateAIContent(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          technicalAccuracy: { type: Type.INTEGER, description: "Score from 0 to 100 for technical precision." },
          communication: { type: Type.INTEGER, description: "Score from 0 to 100 for presentation and tone." },
          confidence: { type: Type.INTEGER, description: "Score from 0 to 100 representing certainty." },
          fluency: { type: Type.INTEGER, description: "Score from 0 to 100 for flow." },
          grammar: { type: Type.INTEGER, description: "Score from 0 to 100 for sentence structures." },
          vocabulary: { type: Type.INTEGER, description: "Score from 0 to 100 for industry terminology." },
          logicalThinking: { type: Type.INTEGER, description: "Score from 0 to 100." },
          problemSolving: { type: Type.INTEGER, description: "Score from 0 to 100." },
          responseCompleteness: { type: Type.INTEGER, description: "Score from 0 to 100." },
          speakingSpeed: { type: Type.INTEGER, description: "Average word count speed e.g. 130 words/min" },
          fillerWords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Filler words detected e.g. ['um', 'like']."
          },
          timeManagement: { type: Type.INTEGER, description: "Score from 0 to 100." },
          feedback: { type: Type.STRING, description: "Encouraging, descriptive corporate feedback." },
          verdict: {
            type: Type.STRING,
            description: "One of: Strong, Average, Weak"
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Top strengths in the answer."
          },
          improvementPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific improvement suggestions."
          },
          keyInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Important interview insights derived from the answer."
          },
          codeAnalysis: {
            type: Type.OBJECT,
            properties: {
              timeComplexity: { type: Type.STRING },
              spaceComplexity: { type: Type.STRING },
              optimizationSuggestions: { type: Type.STRING },
              bestSolutionExplanation: { type: Type.STRING }
            },
            description: "Omit or include if coding question."
          }
        },
        required: [
          "technicalAccuracy",
          "communication",
          "confidence",
          "fluency",
          "grammar",
          "vocabulary",
          "logicalThinking",
          "problemSolving",
          "responseCompleteness",
          "speakingSpeed",
          "fillerWords",
          "timeManagement",
          "feedback",
          "verdict",
          "strengths",
          "improvementPoints",
          "keyInsights"
        ]
      }
    });

  const evaluationText = response.text;

console.log("Evaluation Response:", evaluationText);

let evaluation;

try {
  const cleaned = evaluationText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found");
  }

  const jsonOnly = cleaned.substring(start, end + 1);

  evaluation = JSON.parse(jsonOnly);
  if (!evaluation.technicalAccuracy) {
    evaluation = {
      technicalAccuracy: evaluation["Technical Knowledge"] || 0,
      communication: evaluation["Communication Skills"] || 0,
      confidence: evaluation["Overall Score"] || 0,
      fluency: evaluation["Overall Score"] || 0,
      grammar: evaluation["Overall Score"] || 0,
      vocabulary: evaluation["Overall Score"] || 0,
      logicalThinking: evaluation["Relevance"] || 0,
      problemSolving: evaluation["Problem Solving"] || 0,
      responseCompleteness: evaluation["Overall Score"] || 0,
      speakingSpeed: evaluation["Words Per Minute"] || 0,
      fillerWords: evaluation["Filler Words"] || [],
      timeManagement: 80,
      feedback: evaluation["Feedback"] || "",
      codeAnalysis: {
        timeComplexity: "",
        spaceComplexity: "",
        optimizationSuggestions: "",
        bestSolutionExplanation: ""
      }
    };
  }
} catch (err) {
  console.error("Evaluation Parse Error:", err);
  evaluation = buildFallbackEvaluation(question, userAnswer, Boolean(isCoding), language);
}

res.json(evaluation);
} catch (err: any) {
  console.error("Error evaluating answer:", err);
  const fallbackEvaluation = buildFallbackEvaluation(question, userAnswer, Boolean(isCoding), language);
  res.json(fallbackEvaluation);
}
});

// Submit Completed Session & Generate Performance Dashboard
app.post("/api/interview/submit-session", async (req, res) => {
  const { config, questions, durationMs } = req.body;

  try {
    const ai = getGeminiClient();

    const prompt = `You are an executive hiring board reviewing a completed interview.
Company: ${config.company}
Role: ${config.jobRole} (${config.experience})
Type: ${config.type}
Difficulty: ${config.difficulty}

Questions & Answers Submitted:
${questions.map((q: any, i: number) => `
Q${i+1}: "${q.question}" (Type: ${q.type}, Category: ${q.category})
Answer: "${q.userAnswer || q.userCode || "No response"}"
Individual Evaluation: ${q.evaluation ? JSON.stringify(q.evaluation) : "None"}
`).join("\n")}

Thoroughly compile a Final Performance Report Dashboard.
1. Formulate exact scoring metrics (overallScore, readiness %, technicalScore, codingScore, communicationScore, confidenceScore, problemSolvingScore, timeManagementScore, grammarScore, fluencyScore).
2. Segment scores by core academic subjects: e.g., "DSA", "DBMS", "OS", "System Design", "HR", "SQL" depending on subjects encountered in the interview questions.
3. Identify exact professional Strengths (at least 4 bullets).
4. Outline exact positive, encouraging Areas to Improve (at least 3 items), each detailing: Why it matters, Current level (e.g. 50%), Recommended resources, and Estimated time.
5. Devise a customized, personalized 4-week recovery study plan to patch their weak areas (Week 1, Week 2, Week 3, Week 4).
6. Generate an executive Recruiter-style professional Summary.

Return a strict JSON response conforming to the specified schema. No markup wraps.`;

    const response = await generateAIContent(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.INTEGER },
          readiness: { type: Type.INTEGER },
          technicalScore: { type: Type.INTEGER },
          codingScore: { type: Type.INTEGER },
          communicationScore: { type: Type.INTEGER },
          confidenceScore: { type: Type.INTEGER },
          problemSolvingScore: { type: Type.INTEGER },
          timeManagementScore: { type: Type.INTEGER },
          grammarScore: { type: Type.INTEGER },
          fluencyScore: { type: Type.INTEGER },
          subjectScores: {
            type: Type.OBJECT,
            description: "Subject score map. E.g. {'DSA': 86, 'DBMS': 74, 'OS': 60}."
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          improvements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                whyItMatters: { type: Type.STRING },
                currentLevel: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimatedTime: { type: Type.STRING }
              },
              required: ["topic", "whyItMatters", "currentLevel", "resources", "estimatedTime"]
            }
          },
          recoveryPlan: {
            type: Type.OBJECT,
            properties: {
              week1: { type: Type.ARRAY, items: { type: Type.STRING } },
              week2: { type: Type.ARRAY, items: { type: Type.STRING } },
              week3: { type: Type.ARRAY, items: { type: Type.STRING } },
              week4: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["week1", "week2", "week3", "week4"]
          },
          recruiterSummary: { type: Type.STRING }
        },
        required: [
          "overallScore",
          "readiness",
          "technicalScore",
          "codingScore",
          "communicationScore",
          "confidenceScore",
          "problemSolvingScore",
          "timeManagementScore",
          "grammarScore",
          "fluencyScore",
          "subjectScores",
          "strengths",
          "improvements",
          "recoveryPlan",
          "recruiterSummary"
        ]
      }
    });

  const cleaned = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const start = cleaned.indexOf("{");
const end = cleaned.lastIndexOf("}");

const jsonOnly = cleaned.substring(start, end + 1);

const reportData = JSON.parse(jsonOnly);
    const reportId = `rep-${Date.now()}`;
    const dateStr = new Date().toISOString().split("T")[0];

    const finalReport = {
      id: reportId,
      date: dateStr,
      config,
      ...reportData,
      certificateId: reportData.overallScore >= 70 ? `CERT-${Math.floor(100000 + Math.random() * 900000)}` : undefined
    };

    // Save report in database.json
    const db = readDB();
    db.interviews.unshift(finalReport);

    // Update user stats
    const email = req.body.email || "demo@example.com";
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.streak += 1;
      user.recentInterviewsCount += 1;
      user.overallScore = Math.round((user.overallScore * (user.recentInterviewsCount - 1) + finalReport.overallScore) / user.recentInterviewsCount);
      user.readiness = Math.round((user.readiness + finalReport.readiness) / 2);

      // Award dynamic achievements
      if (user.recentInterviewsCount === 1) {
        user.achievements.push({
          id: `ach-${Date.now()}-1`,
          title: "First Step",
          description: "Completed your first mock interview.",
          unlockedAt: dateStr,
          icon: "CheckCircle"
        });
      }
      if (finalReport.overallScore >= 90) {
        user.achievements.push({
          id: `ach-${Date.now()}-2`,
          title: "Master Elite",
          description: "Scored 90%+ overall in an interview.",
          unlockedAt: dateStr,
          icon: "Award"
        });
      }
    }

    writeDB(db);

    res.json(finalReport);
  } catch (err: any) {
    console.error("Error submitting session:", err);
    res.status(500).json({ error: err.message || "Failed to submit session details." });
  }
});


// ================= RESUME ANALYZER =================

app.post("/api/resume/analyze", async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "Please provide resume content." });
  }

  try {
    const ai = getGeminiClient();

    const prompt = `You are an elite Applicant Tracking System (ATS) algorithm and seasoned recruiter.
Analyze the following resume details:
"${resumeText}"

Evaluate and output details including:
- ATS Score (0 to 100)
- Missing keywords (list of technical/role terms)
- Grammar suggestions
- Skill analysis
- Concrete improvements for impact
- Recommended skills to learn
- Job interview readiness prediction

Return a strict JSON response using only the following keys exactly:
atsScore, missingKeywords, grammarSuggestions, skillAnalysis, improvements, recommendedSkills, interviewPrediction.
Do not include markdown, explanation text, or any wrapper outside of valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            grammarSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            interviewPrediction: { type: Type.STRING }
          },
          required: [
            "atsScore",
            "missingKeywords",
            "grammarSuggestions",
            "skillAnalysis",
            "improvements",
            "recommendedSkills",
            "interviewPrediction"
          ]
        }
      }
    });

    const cleaned = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Unable to parse AI resume report response.");
    }

    const jsonOnly = cleaned.substring(start, end + 1);
    const parsed = JSON.parse(jsonOnly);
    const normalized = normalizeAtsReport(parsed);

    res.json(normalized);
  } catch (err: any) {
    console.error("Error analyzing resume:", err);
    res.status(500).json({ error: err.message || "Failed to analyze resume details. Ensure Gemini API config is correct." });

  }
});


// ================= AI GENERAL CHAT ASSISTANT =================

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body; // array of {role, content}

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array required." });
  }

  try {
    const ai = getGeminiClient();

    const systemPrompt = "You are a friendly, elite technical recruiter and interview mentor. Help the user prepare with tips, code checks, questions, or general motivation.";

    // Convert to Gemini API format
    // Just map the last message or construct a contents array
    const lastMessage = messages[messages.length - 1];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: lastMessage.content,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Error in AI chat helper:", err);
    res.status(500).json({ error: err.message || "Failed to retrieve helper answer." });
  }
});

app.post("/api/chat/assistant", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    const ai = getGeminiClient();

    const systemPrompt = "You are a friendly, elite technical recruiter and interview mentor. Help the user prepare with tips, code checks, questions, or general motivation.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Error in AI chat assistant helper:", err);
    res.status(500).json({ error: err.message || "Failed to retrieve helper answer." });
  }
});


// ================= VITE ASSET MIDDLEWARE =================

async function startServer() {
  const desiredPort = Number(process.env.PORT) || PORT;
  const defaultHmrPort = 24678;
  const activePort = await findAvailablePort(desiredPort);
  const hmrPort = await findAvailablePort(defaultHmrPort);

  if (activePort !== desiredPort) {
    console.warn(`Port ${desiredPort} is busy. Falling back to available port ${activePort}.`);
  }

  if (hmrPort !== defaultHmrPort) {
    console.warn(`WebSocket HMR port ${defaultHmrPort} is busy. Using ${hmrPort} instead.`);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { port: hmrPort }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(activePort, "0.0.0.0", () => {
    console.log(`AI Interview Preparation Platform server running on http://localhost:${activePort}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
