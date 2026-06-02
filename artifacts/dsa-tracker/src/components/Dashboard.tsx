import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/revision";
import { Question } from "@/lib/types";
import { Brain, Flame, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard({ questions }: { questions: Question[] }) {
  const stats = getDashboardStats(questions);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card className="border-l-4 border-l-primary bg-primary/5 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Questions tracked</p>
            <div className="h-1 rounded-full bg-muted overflow-hidden mt-3">
              <div className="h-full rounded-full bg-primary transition-all" style={{width: `100%`}} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-l-4 border-l-destructive bg-destructive/5 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Weak Links</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Flame className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-destructive">{stats.weak}</div>
            <p className="text-xs text-muted-foreground mt-1">Confidence ≤ 2</p>
            <div className="h-1 rounded-full bg-muted overflow-hidden mt-3">
              <div className="h-full rounded-full bg-destructive transition-all" style={{width: `${stats.total > 0 ? Math.round((stats.weak/stats.total)*100) : 0}%`}} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-500/5 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Mastered</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500">{stats.strong}</div>
            <p className="text-xs text-muted-foreground mt-1">Confidence ≥ 4</p>
            <div className="h-1 rounded-full bg-muted overflow-hidden mt-3">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{width: `${stats.total > 0 ? Math.round((stats.strong/stats.total)*100) : 0}%`}} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-l-4 border-l-amber-500 bg-amber-500/5 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-500">Focus Area</CardTitle>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-500 truncate" title={stats.mostFrequentWeakTopic}>
              {stats.mostFrequentWeakTopic}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Most frequent weak tag</p>
            <div className="h-1 rounded-full bg-muted overflow-hidden mt-3">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{width: `100%`}} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
