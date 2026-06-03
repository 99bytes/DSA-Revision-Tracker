import { Link } from "wouter";
import { ArrowRight, Code2, BrainCircuit, LineChart } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header */}
      <header className="border-b border-black/5 dark:border-white/5 bg-background/80 dark:bg-background/10 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-neutral-200 text-white dark:text-black flex items-center justify-center font-extrabold text-xs tracking-tight shadow-md">
              DSA
            </div>
            <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">
              Revision <span className="text-violet-600 dark:text-violet-400 font-bold">Tracker</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all bg-black hover:bg-black/80 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-white dark:text-black hover:scale-105 h-9 py-2 px-5 shadow-md border-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="inline-flex items-center justify-center rounded-full px-3 py-1 mb-8 border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-wide uppercase">
          Build Muscle Memory
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black dark:text-white max-w-3xl mb-6 leading-tight">
          Master Data Structures & Algorithms.
        </h1>
        
        <p className="text-lg md:text-xl text-black/60 dark:text-white/60 max-w-2xl mb-10 leading-relaxed">
          Stop forgetting the problems you've already solved. Use confidence-based spaced repetition to optimize your interview prep.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-full text-base font-bold transition-all bg-black hover:bg-black/80 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-white dark:text-black hover:scale-105 h-12 px-8 shadow-lg w-full sm:w-auto"
          >
            Start Tracking Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Minimal Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-left">
          <div className="p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <Code2 className="w-8 h-8 text-violet-500 mb-4" />
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Track Everything</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Log problems from LeetCode, Codeforces, or anywhere else in one unified dashboard.</p>
          </div>
          <div className="p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <BrainCircuit className="w-8 h-8 text-cyan-500 mb-4" />
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Spaced Repetition</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Rate your confidence. We'll automatically schedule when you should review it next.</p>
          </div>
          <div className="p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <LineChart className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Identify Weaknesses</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Beautiful analytics highlight exactly which topics and concepts need your focus.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-black/40 dark:text-white/40">
        <p>© {new Date().getFullYear()} DSA Revision Tracker. Built for developers.</p>
      </footer>
    </div>
  );
}
