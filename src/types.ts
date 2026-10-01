export type JobRole =
  | "Software Engineer"
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "Data Scientist"
  | "AI Engineer"
  | "DevOps Engineer"
  | "Cyber Security"
  | "Product Manager";

export type ExperienceLevel = "Fresher" | "1-2 Years" | "3-5 Years" | "Senior";

export type InterviewType = "Technical" | "HR" | "Behavioral" | "System Design" | "Mixed";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type InterviewDuration = "10 Minutes" | "20 Minutes" | "30 Minutes" | "45 Minutes" | "60 Minutes";

export type CompanyName =
  | "Google"
  | "Microsoft"
  | "Amazon"
  | "Meta"
  | "Apple"
  | "Adobe"
  | "Oracle"
  | "Netflix"
  | "Flipkart"
  | "Walmart"
  | "TCS"
  | "Infosys"
  | "Wipro"
  | "Accenture"
  | "Cognizant"
  | "Capgemini";

export interface InterviewConfig {
  jobRole: JobRole;
  experience: ExperienceLevel;
  type: InterviewType;
  difficulty: DifficultyLevel;
  duration: InterviewDuration;
  company: CompanyName;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string; // e.g., "DSA", "DBMS", "OS", "System Design", "HR"
  type: "Theory" | "Coding" | "Scenario Based" | "Debugging" | "MCQ" | "Output Prediction" | "Case Study";
  codeSnippet?: string; // Optional code starter for coding questions, or output code
  codeLanguage?: string;
  options?: string[]; // For MCQs
  correctOption?: string;
  testCases?: TestCase[]; // For coding
  userAnswer?: string;
  userCode?: string;
  userCodeLanguage?: string;
  evaluation?: AnswerEvaluation;
}

export interface AnswerEvaluation {
  technicalAccuracy: number; // 0-100
  communication: number; // 0-100
  confidence: number; // 0-100
  fluency: number; // 0-100
  grammar: number; // 0-100
  vocabulary: number; // 0-100
  logicalThinking: number; // 0-100
  problemSolving: number; // 0-100
  responseCompleteness: number; // 0-100
  speakingSpeed: number; // e.g. 130 words/min
  fillerWords: string[]; // list of words like "um", "ah", "like"
  timeManagement: number; // 0-100
  feedback: string;
  timeTaken?: number; // in seconds
  verdict?: "Strong" | "Average" | "Weak";
  strengths?: string[];
  improvementPoints?: string[];
  keyInsights?: string[];
  codeAnalysis?: {
    timeComplexity: string;
    spaceComplexity: string;
    optimizationSuggestions: string;
    bestSolutionExplanation: string;
  };
}

export interface WeakAreaItem {
  topic: string;
  whyItMatters: string;
  currentLevel: string; // e.g., "Beginner (45%)"
  resources: string[]; // link names
  estimatedTime: string; // e.g., "6 hours"
}

export interface PerformanceReport {
  id: string;
  date: string;
  config: InterviewConfig;
  overallScore: number;
  readiness: number;
  technicalScore: number;
  codingScore: number;
  communicationScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  timeManagementScore: number;
  grammarScore: number;
  fluencyScore: number;
  subjectScores: { [key: string]: number }; // e.g., { "DSA": 86, "DBMS": 74 }
  strengths: string[];
  improvements: WeakAreaItem[];
  recoveryPlan: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  recruiterSummary: string;
  certificateId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  isVerified: boolean;
  streak: number;
  overallScore: number;
  readiness: number;
  recentInterviewsCount: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
  question: string;
}

export interface Bookmark {
  id: string;
  question: string;
  category: string;
  role: string;
  savedAt: string;
}

export interface InterviewNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface QuestionBankItem {
  id: string;
  question: string;
  role: string;
  company: string;
  category: string;
  difficulty: string;
  type: string;
}
