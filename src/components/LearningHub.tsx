import React, { useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Code,
  FileText,
  Video,
  ExternalLink,
  Search,
  Compass,
  CheckCircle,
  Hash,
  Database,
  Cpu,
  Globe,
  Terminal,
  Zap
} from "lucide-react";

export default function LearningHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "DSA", "DBMS", "OS", "CN", "OOP", "SQL", "Full Stack", "AI & ML", "Aptitude"];

  const resources = [
    {
      title: "Striver's A2Z DSA Course Sheet",
      category: "DSA",
      type: "Sheet",
      description: "Step-by-step master roadmap covering all concepts from basic arrays up to advanced Graphs, Trees, and DP patterns.",
      linkName: "Takeuforward A2Z Sheet",
      link: "https://takeuforward.org/strivers-a2z-dsa-course/",
      icon: <Code className="w-5 h-5 text-indigo-400" />
    },
    {
      title: "NeetCode 150 Roadmap",
      category: "DSA",
      type: "Roadmap",
      description: "Curated collection of 150 critical coding interview questions, categorized by topics with detailed visual video explanations.",
      linkName: "Neetcode.io Roadmap",
      link: "https://neetcode.io/practice",
      icon: <Compass className="w-5 h-5 text-purple-400" />
    },
    {
      title: "LeetCode Patterns Guide",
      category: "DSA",
      type: "Practice",
      description: "Discover core sliding window, two-pointer, fast & slow pointer, and merge interval structures to solve hundreds of LC questions.",
      linkName: "Sean Prasad LC Patterns",
      link: "https://seanprashad.com/leetcode-patterns/",
      icon: <Terminal className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "SQL Index Tuning & Joins Master",
      category: "SQL",
      type: "Article",
      description: "Learn index query planners, B-Trees vs Hash maps, Leftmost Prefix rule, self joins, and advanced Window Operations (Partition By).",
      linkName: "SQL Index Guide",
      link: "https://use-the-index-luke.com/",
      icon: <Database className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Operating Systems (OS) Placement Notes",
      category: "OS",
      type: "Notes",
      description: "Revise deadlocks (Banker's Algorithm), Thread scheduling (Mutex/Semaphores), paging memory, and virtual cache thrashing.",
      linkName: "GateSmasher OS Series",
      link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p",
      icon: <Cpu className="w-5 h-5 text-pink-400" />
    },
    {
      title: "Computer Networks (CN) Core Sheet",
      category: "CN",
      type: "Notes",
      description: "TCP/IP Protocols, three-way handshakes, OSI Layers vs TCP Layers, DNS architecture, HTTP status codes, and TLS/SSL decodes.",
      linkName: "GateSmasher CN Series",
      link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joFstVOfguDOnUJ",
      icon: <Globe className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "SOLID Principles & OOP Patterns",
      category: "OOP",
      type: "Article",
      description: "Understand Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion with python code examples.",
      linkName: "Refactoring.Guru Patterns",
      link: "https://refactoring.guru/design-patterns",
      icon: <FileText className="w-5 h-5 text-indigo-400" />
    },
    {
      title: "React & Node Full Stack Worksheets",
      category: "Full Stack",
      type: "Practice",
      description: "React Virtual DOM, hooks lifecycle, state optimizations, Express middleware architectures, and token validations (JWT).",
      linkName: "Full Stack Open Course",
      link: "https://fullstackopen.com/en/",
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Aptitude and Reasoning Placements Prep",
      category: "Aptitude",
      type: "Video",
      description: "Master Permutations & Combinations, Probability, Speed-Distance, Logical puzzles, and Syllogisms for initial filter rounds.",
      linkName: "Indiabix Aptitude",
      link: "https://www.indiabix.com/",
      icon: <Video className="w-5 h-5 text-pink-400" />
    }
  ];

  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-24 text-gray-100">
      {/* Header title */}
      <div className="text-left space-y-1 mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">Placement Learning Hub</h1>
        <p className="text-xs sm:text-sm text-gray-400">Master core concepts, practice popular roadmap worksheets, and optimize your coding structures.</p>
      </div>

      {/* Search & filters bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/30 border border-slate-900 p-4 rounded-xl mb-8">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search syllabus, sheets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filters Carousel */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat ? "bg-indigo-600/20 border border-indigo-500 text-indigo-300" : "bg-slate-950/40 border-slate-900 text-gray-400 hover:border-slate-800"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/30 transition-all flex flex-col justify-between text-left group"
          >
            <div className="space-y-4">
              {/* Type Badge */}
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-extrabold uppercase tracking-wider">
                  {res.type}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{res.category}</span>
              </div>

              {/* Title & info */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                  {res.icon}
                  <span>{res.title}</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {res.description}
                </p>
              </div>
            </div>

            {/* Link button */}
            <div className="pt-6 border-t border-slate-950/40 mt-6">
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider"
              >
                <span>Access {res.linkName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <div className="col-span-3 py-16 text-center text-xs text-gray-500">
            No placement resources found matching the specified filters. Try selecting a different category.
          </div>
        )}
      </div>

      {/* Extra advice box */}
      <div className="p-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 text-left space-y-2 mt-12 max-w-4xl mx-auto">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" /> Recommended Placement Practice Order
        </h4>
        <p className="text-xs text-emerald-300/80 leading-relaxed">
          Start with <strong className="text-white">Striver A2Z Arrays/Strings</strong>, then revise <strong className="text-white">Operating Systems (Deadlocks)</strong>, practice writing complex SQL join queries, and conclude with structured behavioral mocks using STAR framework.
        </p>
      </div>
    </div>
  );
}
