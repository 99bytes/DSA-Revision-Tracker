import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code2, BrainCircuit, LineChart } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const [headline, setHeadline] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    "Master Data Structures & Algorithms.",
    "Crush your technical interviews.",
    "Build unshakeable muscle memory.",
    "Track your LeetCode progress.",
    "Conquer dynamic programming."
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (headline === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        timeoutId = setTimeout(() => {
          setHeadline(currentPhrase.slice(0, headline.length - 1));
        }, 40);
      }
    } else {
      if (headline === currentPhrase) {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 3500);
      } else {
        timeoutId = setTimeout(() => {
          setHeadline(currentPhrase.slice(0, headline.length + 1));
        }, 80);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [headline, isDeleting, phraseIndex]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 dark:bg-violet-500/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 dark:bg-cyan-500/15 blur-[120px]" />
      </div>

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
      <main className="flex-1 flex flex-col items-center justify-center py-12 md:py-20 px-4 text-center">
        <div className="inline-flex items-center justify-center rounded-full px-3 py-1 mb-8 border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold tracking-wide uppercase">
          Build Muscle Memory
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black dark:text-white max-w-3xl mb-6 leading-tight min-h-[120px] md:min-h-[160px] flex items-center justify-center">
          <span>
            {headline}
            <span className="inline-block w-[3px] h-[40px] md:h-[60px] ml-1 md:ml-2 bg-violet-600 dark:bg-violet-400 animate-pulse align-middle -mt-2"></span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-black/60 dark:text-white/60 max-w-2xl mb-10 leading-relaxed">
          Stop forgetting the problems you've already solved. Use confidence-based spaced repetition to optimize your interview prep.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
          <Link
            href="/sign-up"
            className="group relative inline-flex items-center justify-center rounded-full text-base font-bold transition-all bg-black dark:bg-neutral-200 text-white dark:text-black hover:scale-105 h-12 px-8 w-full sm:w-auto border-0"
          >
            {/* Glowing Drop Shadow */}
            <div className="absolute inset-0 rounded-full bg-violet-500/40 dark:bg-violet-400/50 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <span className="relative z-10 flex items-center">
              Start Tracking Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Minimal Features Row */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-left"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="group p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <Code2 className="w-8 h-8 text-violet-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Track Everything</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Log problems from LeetCode, Codeforces, or anywhere else in one unified dashboard.</p>
          </motion.div>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="group p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <BrainCircuit className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Spaced Repetition</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Rate your confidence. We'll automatically schedule when you should review it next.</p>
          </motion.div>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="group p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <LineChart className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Identify Weaknesses</h3>
            <p className="text-sm text-black/60 dark:text-white/60">Beautiful analytics highlight exactly which topics and concepts need your focus.</p>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-8 text-center text-sm text-black/40 dark:text-white/40">
        <p>© {new Date().getFullYear()} DSA Revision Tracker. Built for developers.</p>
      </footer>
    </div>
  );
}
