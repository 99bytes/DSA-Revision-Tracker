import { Question } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Trash2 } from "lucide-react";
import { calculateNextRevision, isOverdue } from "@/lib/revision";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export function ConfidenceDots({ level }: { level: number }) {
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {[0, 1, 2, 3, 4].map(idx => (
        <div
          key={idx}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            idx < level ? colors[level - 1] : "opacity-10 bg-black dark:bg-white"
          )}
        />
      ))}
      <span className="ml-2 text-xs font-bold text-black/80 dark:text-white/80">{level}</span>
    </div>
  );
}

const platformColors: Record<string, string> = {
  LeetCode: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 font-medium",
  GFG: "bg-green-500/10 text-green-700 dark:text-green-500 border-green-500/20 font-medium",
  Codeforces: "bg-blue-500/10 text-blue-700 dark:text-blue-500 border-blue-500/20 font-medium",
  NeetCode: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-500 border-cyan-500/20 font-medium",
  Other: "bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10 font-medium"
};

interface QuestionTableProps {
  questions: Question[];
  onMarkRevised: (q: Question) => void;
  onDelete: (id: string) => void;
  onSelectQuestion: (q: Question) => void;
}

export function QuestionTable({ questions, onMarkRevised, onDelete, onSelectQuestion }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-black/10 dark:border-white/10 border-dashed rounded-3xl bg-transparent">
        <p className="text-black/50 dark:text-white/50 text-sm">No questions found. Adjust filters or add new questions.</p>
      </div>
    );
  }

  return (
    <div className="border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden bg-transparent shadow-none relative mt-8">
      <div className="relative z-10 overflow-x-auto pb-4 sm:pb-0">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="border-b border-black/5 dark:border-white/5 hover:bg-transparent">
                <TableHead className="pl-6 font-medium tracking-wide text-xs uppercase text-black/50 dark:text-white/50 h-14">Question</TableHead>
                <TableHead className="font-medium tracking-wide text-xs uppercase text-black/50 dark:text-white/50 h-14 w-[120px]">Platform</TableHead>
                <TableHead className="font-medium tracking-wide text-xs uppercase text-black/50 dark:text-white/50 h-14 w-[160px]">Tags</TableHead>
                <TableHead className="text-center font-medium tracking-wide text-xs uppercase text-black/50 dark:text-white/50 h-14 w-[140px]">Confidence</TableHead>
                <TableHead className="font-medium tracking-wide text-xs uppercase text-black/50 dark:text-white/50 h-14 w-[120px]">Next Rev.</TableHead>
                <TableHead className="text-right pr-6 font-medium tracking-wide text-xs uppercase text-black/50 dark:text-white/50 h-14 w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            <AnimatePresence>
              {questions.map((q) => {
                const isUrgent = isOverdue(q);
                return (
                  <motion.tr
                    key={q.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group transition-colors duration-200 border-b border-b-black/5 dark:border-b-white/5 even:bg-black/[0.02] dark:even:bg-white/[0.02] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] relative h-16`}
                  >
                    <TableCell className="pl-6">
                      <button
                        onClick={() => onSelectQuestion(q)}
                        className="font-bold hover:underline decoration-black/30 dark:decoration-white/30 underline-offset-4 text-black dark:text-white truncate max-w-[200px] sm:max-w-[300px] text-left block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
                      >
                        {q.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit", platformColors[q.platform] || platformColors.Other)}>
                        <CheckCircle2 className="w-3 h-3" />
                        {q.platform}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {q.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[11px] bg-black/[0.02] dark:bg-white/[0.02] text-black/80 dark:text-white/80 border border-black/5 dark:border-white/5 px-2.5 py-0.5 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                        {q.tags.length > 2 && (
                          <span className="text-[11px] bg-black/[0.02] dark:bg-white/[0.02] text-black/80 dark:text-white/80 border border-black/5 dark:border-white/5 px-2.5 py-0.5 rounded-full font-medium">
                            +{q.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ConfidenceDots level={q.confidence} />
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-sm font-medium",
                        isUrgent ? "text-red-500 font-bold" : "text-black/70 dark:text-white/70"
                      )}>
                        {format(new Date(calculateNextRevision(q.lastRevised, q.confidence)), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors rounded-full"
                          onClick={() => onMarkRevised(q)}
                          title="Mark as Revised Today"
                          data-testid={`btn-revise-${q.id}`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Link href={`/edit/${q.id}`} className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-black/50 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-full"
                          onClick={() => onDelete(q.id)}
                          title="Delete"
                          data-testid={`btn-delete-${q.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
