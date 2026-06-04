import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Sparkles, ArrowRight, Github, Twitter, Brain, Target, Zap, CheckCircle2, ChevronRight, Play, Code2, BrainCircuit, LineChart, Flame, Tags, Clock, BookOpen, MonitorPlay } from "lucide-react";
import { AlienIcon } from "@/components/AlienIcon";
import { ThemeSelector } from "@/components/ThemeSelector";
import { MusicButton } from "@/components/MusicButton";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const quotesBank = [
  {
    title: "Patience is O(1)",
    desc: "Take a deep breath. Not every bug is fixed in constant time.",
    icon: BrainCircuit, iconColor: "text-primary", gradient: "from-primary/10", rotate: -4
  },
  {
    title: "Divide & Conquer",
    desc: "Break the problem down until it's small enough to solve.",
    icon: Code2, iconColor: "text-secondary", gradient: "from-secondary/10", rotate: 5
  },
  {
    title: "Memoization",
    desc: "Those who cannot remember the past are condemned to recalculate it.",
    icon: BookOpen, iconColor: "text-emerald-500", gradient: "from-emerald-500/10", rotate: -3
  },
  {
    title: "Two Pointers",
    desc: "Sometimes you need to look at the problem from both ends.",
    icon: ArrowRight, iconColor: "text-orange-500", gradient: "from-orange-500/10", rotate: 4
  },
  {
    title: "Graph Theory",
    desc: "It's all about the connections you make along the way.",
    icon: LineChart, iconColor: "text-pink-500", gradient: "from-pink-500/10", rotate: -5
  },
  {
    title: "Greedy Approach",
    desc: "Make the best local choice and hope for the global optimum.",
    icon: Flame, iconColor: "text-red-500", gradient: "from-red-500/10", rotate: 3
  },
  {
    title: "Sliding Window",
    desc: "Focus on the current frame, then move forward.",
    icon: MonitorPlay, iconColor: "text-blue-500", gradient: "from-blue-500/10", rotate: -4
  },
  {
    title: "Bit Manipulation",
    desc: "True mastery lies in the zeros and ones.",
    icon: Tags, iconColor: "text-yellow-500", gradient: "from-yellow-500/10", rotate: 5
  },
  {
    title: "Hash Tables",
    desc: "The fastest way to find what you've already seen.",
    icon: Code2, iconColor: "text-purple-500", gradient: "from-purple-500/10", rotate: -2
  },
  {
    title: "Recursion",
    desc: "To understand recursion, one must first understand recursion.",
    icon: BrainCircuit, iconColor: "text-teal-500", gradient: "from-teal-500/10", rotate: 6
  },
  {
    title: "Dynamic Programming",
    desc: "Solve it once, remember the answer.",
    icon: Clock, iconColor: "text-indigo-500", gradient: "from-indigo-500/10", rotate: -5
  },
  {
    title: "Binary Search",
    desc: "Cut the search space in half, every single time.",
    icon: Code2, iconColor: "text-rose-500", gradient: "from-rose-500/10", rotate: 3
  },
  {
    title: "Breadth-First",
    desc: "Explore your immediate surroundings before going deep.",
    icon: BrainCircuit, iconColor: "text-lime-500", gradient: "from-lime-500/10", rotate: -4
  },
  {
    title: "Depth-First",
    desc: "Go as far as you can before turning back.",
    icon: Flame, iconColor: "text-fuchsia-500", gradient: "from-fuchsia-500/10", rotate: 4
  },
  {
    title: "Space Complexity",
    desc: "Memory is cheap, but not that cheap.",
    icon: Clock, iconColor: "text-sky-500", gradient: "from-sky-500/10", rotate: -2
  }
];

function FloatingCard({ feature, clientX, clientY, index, cx, cy, sectionRef }: { feature: any, clientX: any, clientY: any, index: number, cx: number, cy: number, sectionRef: React.RefObject<HTMLElement | null> }) {
  const xOffset = useMotionValue(0);
  const yOffset = useMotionValue(0);
  const scaleVal = useMotionValue(1);

  // Bouncy spring configuration for the repulsion effect
  const springConfig = { damping: 15, stiffness: 120, mass: 0.8 };
  const xSpring = useSpring(xOffset, springConfig);
  const ySpring = useSpring(yOffset, springConfig);
  const scaleSpring = useSpring(scaleVal, springConfig);

  useAnimationFrame(() => {
    const mx = clientX.get();
    const my = clientY.get();
    if (mx === -1000 || !sectionRef.current) {
      // Mouse is outside the section, relax back to original state
      xOffset.set(0);
      yOffset.set(0);
      scaleVal.set(1);
      return;
    }

    const rect = sectionRef.current.getBoundingClientRect();

    // Card's center coordinate in pixels (relative to viewport)
    const cardPxX = rect.left + (cx / 100) * rect.width;
    const cardPxY = rect.top + (cy / 100) * rect.height;

    const dx = cardPxX - mx;
    const dy = cardPxY - my;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Distance threshold to trigger repulsion (pixels)
    const threshold = 400;

    if (dist < threshold && dist > 0) {
      // Force is stronger the closer the mouse is (0 to 1)
      const force = (threshold - dist) / threshold;

      // Push away heavily (up to 300px away)
      xOffset.set((dx / dist) * force * 300);
      yOffset.set((dy / dist) * force * 300);

      // Decrease size as it's pushed away
      scaleVal.set(1 - (force * 0.35));
    } else {
      xOffset.set(0);
      yOffset.set(0);
      scaleVal.set(1);
    }
  });

  return (
    <motion.div
      style={{
        top: `${cy}%`,
        left: `${cx}%`,
        x: "-50%",
        y: "-50%"
      }}
      className="absolute z-10"
    >
      {/* Birth & Death Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0, rotate: 20 }}
        transition={{ duration: 0.6, ease: "backOut" }}
      >
        {/* Cursor Repulsion Physics */}
        <motion.div style={{ x: xSpring, y: ySpring, scale: scaleSpring }}>
          {/* Continuous Floating Bobbing */}
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [feature.rotate, feature.rotate + (index % 2 === 0 ? 5 : -5), feature.rotate],
            }}
            transition={{
              duration: 4 + (index % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
            className="group p-5 md:p-6 rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-xl shadow-2xl w-[260px] md:w-[320px] relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            <feature.icon className={`w-8 h-8 ${feature.iconColor} mb-4`} />
            <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-2">{feature.title}</h3>
            <p className="text-xs md:text-sm text-black/60 dark:text-white/60 leading-relaxed pointer-events-none">{feature.desc}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Initial placements to ensure it looks good immediately on load
const INITIAL_POSITIONS = [
  { cx: 15, cy: 15, templateIndex: 0 },
  { cx: 85, cy: 20, templateIndex: 1 },
  { cx: 18, cy: 50, templateIndex: 2 },
  { cx: 82, cy: 55, templateIndex: 3 },
  { cx: 25, cy: 85, templateIndex: 4 },
  { cx: 75, cy: 85, templateIndex: 5 },
  { cx: 50, cy: 25, templateIndex: 6 },
  { cx: 50, cy: 75, templateIndex: 7 }
];

export default function LandingPage() {
  const [headline, setHeadline] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Global mouse tracking for the fixed glow
  const clientX = useMotionValue(-1000);
  const clientY = useMotionValue(-1000);

  const sectionRef = useRef<HTMLElement>(null);

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
    <div
      className="bg-transparent flex flex-col relative pt-16 overflow-x-hidden after:absolute after:inset-0 after:bg-white/10 dark:after:bg-black/20 after:-z-10"
      onPointerMove={(e) => {
        clientX.set(e.clientX);
        clientY.set(e.clientY);
      }}
    >
      {/* Global Glowing Cursor Tracker */}
      <motion.div
        style={{ left: clientX, top: clientY, x: "-50%", y: "-50%" }}
        className="fixed w-[400px] h-[400px] bg-secondary/20 dark:bg-secondary/20 rounded-full blur-[80px] pointer-events-none z-0 mix-blend-screen"
      />

      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 dark:bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 dark:bg-secondary/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-md fixed top-0 inset-x-0 w-full z-50 shadow-sm dark:shadow-none">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlienIcon className="w-9 h-9 shrink-0 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">
              Beatle
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <MusicButton />
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="magical-btn inline-flex items-center justify-center rounded-full text-sm font-bold transition-all bg-black hover:bg-black/80 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-white dark:text-black hover:scale-105 h-9 py-2 px-5 shadow-md border-0 no-hp-shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* PAGE 1: Hero Section */}
      <main className="w-full px-4 text-center z-10">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full max-w-4xl mx-auto relative">
          <div className="inline-flex items-center justify-center rounded-full px-3 py-1 mb-8 border border-primary/20 bg-primary/10 text-primary dark:text-primary text-xs font-semibold tracking-wide uppercase">
            Build Muscle Memory
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-normal text-black dark:text-white max-w-3xl mb-8 leading-tight min-h-[120px] md:min-h-[160px] flex items-center justify-center drop-shadow-lg">
            <span>
              {headline}
              <span className="inline-block w-[3px] h-[40px] md:h-[60px] ml-2 md:ml-3 bg-primary dark:bg-primary animate-pulse align-middle -mt-2"></span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-black/60 dark:text-white/60 max-w-2xl mb-10 leading-relaxed">
            Stop forgetting the problems you've already solved. Use confidence-based spaced repetition to optimize your interview prep.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/sign-up"
              className="magical-btn group relative inline-flex items-center justify-center rounded-full text-base font-bold transition-all bg-black dark:bg-neutral-200 text-white dark:text-black hover:scale-105 h-12 px-8 w-full sm:w-auto border-0 no-hp-shadow"
            >
              <div className="absolute inset-0 rounded-full bg-primary/40 dark:bg-primary/50 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <span className="relative z-10 flex items-center">
                Start Tracking Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* PAGE 2: Floating Water Cards */}
      <section
        ref={sectionRef}
        className="relative w-full h-[100vh] hidden md:block"
      >
        {/* Floating Physics Cards */}
        {INITIAL_POSITIONS.map((pos, index) => (
          <FloatingCard
            key={index}
            feature={quotesBank[pos.templateIndex]}
            clientX={clientX}
            clientY={clientY}
            sectionRef={sectionRef}
            index={index}
            cx={pos.cx}
            cy={pos.cy}
          />
        ))}
      </section>

      {/* Mobile Fallback for Page 2 */}
      <section className="w-full flex flex-col md:hidden px-4 py-20 space-y-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">Words of Wisdom</h2>
        {quotesBank.slice(0, 5).map((feature, i) => (
          <div key={i} className="p-6 rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-xl w-full">
            <feature.icon className={`w-8 h-8 ${feature.iconColor} mb-4`} />
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      <footer className="py-8 text-center text-sm text-black/40 dark:text-white/40 border-t border-black/5 dark:border-white/5 relative z-10 bg-background/80 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Beatle. Built for developers.</p>
      </footer>
    </div>
  );
}
