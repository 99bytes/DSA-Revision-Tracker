import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/revision";
import { Question } from "@/lib/types";
import { Brain, Flame, Target, TrendingUp } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

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
      className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="h-full">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          whileHover={{ scale: 1.02, y: -8 }}
          className="h-full"
        >
        <Card className="border border-black/10 dark:border-white/10 bg-transparent rounded-[2rem] relative overflow-hidden shadow-none hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
            <CardTitle className="text-sm font-medium tracking-wide text-black/70 dark:text-white/70 uppercase">Total Solved</CardTitle>
            <div className="w-10 h-10 rounded-full border border-violet-500/20 flex items-center justify-center bg-violet-500/10 shrink-0">
              <Target className="h-5 w-5 text-violet-500 dark:text-violet-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
            <div className="text-4xl font-light tracking-tight text-black dark:text-white mt-2 min-h-10 flex items-center">
              <CountUp to={stats.total} />
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1">Questions tracked</p>
            <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden mt-5 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-violet-500"
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
        <Card className="border border-black/10 dark:border-white/10 bg-transparent rounded-[2rem] relative overflow-hidden shadow-none hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
            <CardTitle className="text-sm font-medium tracking-wide text-black/70 dark:text-white/70 uppercase">Weak Links</CardTitle>
            <div className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center bg-red-500/10 shrink-0">
              <Flame className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
            <div className="text-4xl font-light tracking-tight text-black dark:text-white mt-2 min-h-10 flex items-center">
              <CountUp to={stats.weak} />
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1">Confidence ≤ 2</p>
            <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden mt-5 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-red-500"
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
        <Card className="border border-black/10 dark:border-white/10 bg-transparent rounded-[2rem] relative overflow-hidden shadow-none hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
            <CardTitle className="text-sm font-medium tracking-wide text-black/70 dark:text-white/70 uppercase">Mastered</CardTitle>
            <div className="w-10 h-10 rounded-full border border-emerald-500/20 flex items-center justify-center bg-emerald-500/10 shrink-0">
              <Brain className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
            <div className="text-4xl font-light tracking-tight text-black dark:text-white mt-2 min-h-10 flex items-center">
              <CountUp to={stats.strong} />
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1">Confidence ≥ 4</p>
            <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden mt-5 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
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
        <Card className="border border-black/10 dark:border-white/10 bg-transparent rounded-[2rem] relative overflow-hidden shadow-none hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
            <CardTitle className="text-sm font-medium tracking-wide text-black/70 dark:text-white/70 uppercase">Focus Area</CardTitle>
            <div className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center bg-amber-500/10 shrink-0">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-end">
            <div className="text-xl font-light text-black dark:text-white mt-3 truncate break-words min-h-10 flex items-center" title={stats.mostFrequentWeakTopic || "None"}>
              {stats.mostFrequentWeakTopic || "None"}
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1">Most frequent weak tag</p>
            <div className="h-1 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden mt-5 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-amber-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
