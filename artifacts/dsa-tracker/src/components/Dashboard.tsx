import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/revision";
import { Question } from "@/lib/types";
import { Brain, Flame, Target, TrendingUp, Scroll, Wand, Sparkles, Map } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { NextRevisionCountdown } from "./NextRevisionCountdown";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { WizardWandIcon } from "./WizardWandIcon";

function CountUp({ to }: { to: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const animation = animate(count, to, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [to]);

  useEffect(() => {
    rounded.on("change", (v) => setDisplay(v));
  }, [rounded]);

  return <>{display}</>;
}

export function Dashboard({ questions }: { questions: Question[] }) {
  const stats = getDashboardStats(questions);
  const { theme } = useTheme();
  const isHP = theme === "harry-potter";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="grid gap-5 grid-cols-1 lg:grid-cols-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="lg:col-span-5 xl:col-span-5 h-full">
        <NextRevisionCountdown questions={questions} stats={stats} />
      </motion.div>

      <div className="grid gap-5 grid-cols-2 lg:col-span-7 xl:col-span-7 h-full content-start">
        <motion.div variants={item} className="h-full">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            whileHover={{ scale: 1.02, y: -8 }}
            className="h-full"
          >
            <Card className={cn("border border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent backdrop-blur-none rounded-[2rem] relative overflow-hidden shadow-sm dark:shadow-none hover:dark:bg-black/20 hover:backdrop-blur-sm transition-all duration-300 h-full flex flex-col", isHP ? "hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:border-[#d4af37]/50" : "hover:dark:shadow-md hover:dark:border-t-white/20")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className={cn("text-sm tracking-wide text-black/70 dark:text-white/70 uppercase", isHP ? "font-bold tracking-normal text-base text-[#d4af37] drop-shadow-md" : "font-medium")}>Total Solved</CardTitle>
                <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center shrink-0", isHP ? "border-[#d4af37]/30 bg-[#d4af37]/10" : "border-primary/20 bg-primary/10")}>
                  {isHP ? <Scroll className="h-5 w-5 text-[#d4af37] drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" /> : <Target className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
                <div className="text-4xl font-light tracking-tight text-black dark:text-white mt-2 min-h-10 flex items-center">
                  <CountUp to={stats.total} />
                </div>
                <p className="text-xs text-black/40 dark:text-white/40 mt-1">Questions tracked</p>
                <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-visible mt-5 shadow-inner relative">
                  <motion.div
                    className={cn("h-full rounded-full absolute left-0 top-0", isHP ? "bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "bg-primary")}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="h-full">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            whileHover={{ scale: 1.02, y: -8 }}
            className="h-full"
          >
            <Card className={cn("border border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent backdrop-blur-none rounded-[2rem] relative overflow-hidden shadow-sm dark:shadow-none hover:dark:bg-black/20 hover:backdrop-blur-sm transition-all duration-300 h-full flex flex-col", isHP ? "hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:border-[#d4af37]/50" : "hover:dark:shadow-md hover:dark:border-t-white/20")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className={cn("text-sm tracking-wide text-black/70 dark:text-white/70 uppercase", isHP ? "font-bold tracking-normal text-base text-[#d4af37] drop-shadow-md" : "font-medium")}>Weak Links</CardTitle>
                <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center shrink-0", isHP ? "border-[#d4af37]/30 bg-[#d4af37]/10" : "border-red-500/20 bg-red-500/10")}>
                  {isHP ? <WizardWandIcon className="h-5 w-5 text-[#d4af37] drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" /> : <Flame className="h-5 w-5 text-red-500" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
                <div className="text-4xl font-light tracking-tight text-black dark:text-white mt-2 min-h-10 flex items-center">
                  <CountUp to={stats.weak} />
                </div>
                <p className="text-xs text-black/40 dark:text-white/40 mt-1">Confidence ≤ 2</p>
                <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-visible mt-5 shadow-inner relative">
                  <motion.div
                    className={cn("h-full rounded-full absolute left-0 top-0", isHP ? "bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "bg-red-500")}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total > 0 ? Math.round((stats.weak / stats.total) * 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="h-full">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
            whileHover={{ scale: 1.02, y: -8 }}
            className="h-full"
          >
            <Card className={cn("border border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent backdrop-blur-none rounded-[2rem] relative overflow-hidden shadow-sm dark:shadow-none hover:dark:bg-black/20 hover:backdrop-blur-sm transition-all duration-300 h-full flex flex-col", isHP ? "hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:border-[#d4af37]/50" : "hover:dark:shadow-md hover:dark:border-t-white/20")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className={cn("text-sm tracking-wide text-black/70 dark:text-white/70 uppercase", isHP ? "font-bold tracking-normal text-base text-[#d4af37] drop-shadow-md" : "font-medium")}>Mastered</CardTitle>
                <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center shrink-0", isHP ? "border-[#d4af37]/30 bg-[#d4af37]/10" : "border-emerald-500/20 bg-emerald-500/10")}>
                  {isHP ? <Sparkles className="h-5 w-5 text-[#d4af37] drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" /> : <Brain className="h-5 w-5 text-emerald-500" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
                <div className="text-4xl font-light tracking-tight text-black dark:text-white mt-2 min-h-10 flex items-center">
                  <CountUp to={stats.strong} />
                </div>
                <p className="text-xs text-black/40 dark:text-white/40 mt-1">Confidence ≥ 4</p>
                <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-visible mt-5 shadow-inner relative">
                  <motion.div
                    className={cn("h-full rounded-full absolute left-0 top-0", isHP ? "bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "bg-emerald-500")}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total > 0 ? Math.round((stats.strong / stats.total) * 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="h-full">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3.6 }}
            whileHover={{ scale: 1.02, y: -8 }}
            className="h-full"
          >
            <Card className={cn("border border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent backdrop-blur-none rounded-[2rem] relative overflow-hidden shadow-sm dark:shadow-none hover:dark:bg-black/20 hover:backdrop-blur-sm transition-all duration-300 h-full flex flex-col", isHP ? "hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:border-[#d4af37]/50" : "hover:dark:shadow-md hover:dark:border-t-white/20")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className={cn("text-sm tracking-wide text-black/70 dark:text-white/70 uppercase", isHP ? "font-bold tracking-normal text-base text-[#d4af37] drop-shadow-md" : "font-medium")}>Focus Area</CardTitle>
                <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center shrink-0", isHP ? "border-[#d4af37]/30 bg-[#d4af37]/10" : "border-amber-500/20 bg-amber-500/10")}>
                  {isHP ? <Map className="h-5 w-5 text-[#d4af37] drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" /> : <TrendingUp className="h-5 w-5 text-amber-500" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
                <div className="text-xl font-light text-black dark:text-white mt-3 truncate break-words min-h-10 flex items-center" title={stats.mostFrequentWeakTopic || "None"}>
                  {stats.mostFrequentWeakTopic || "None"}
                </div>
                <p className="text-xs text-black/40 dark:text-white/40 mt-1">Most frequent weak tag</p>
                <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-visible mt-5 shadow-inner relative">
                  <motion.div
                    className={cn("h-full rounded-full absolute left-0 top-0", isHP ? "bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "bg-amber-500")}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
