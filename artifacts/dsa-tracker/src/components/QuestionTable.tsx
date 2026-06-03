import { Question } from "@/lib/types";
import { calculateNextRevision, isOverdue } from "@/lib/revision";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

export function ConfidenceDots({ level }: { level: number }) {
  const colors = ["bg-red-500", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full transition-opacity ${i <= level ? colors[level-1] : "bg-muted"}`} />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground w-3 font-mono">{level}</span>
    </div>
  );
}

const platformColors: Record<string, string> = {
  LeetCode: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900 dark:text-orange-400",
  GFG: "bg-green-500/10 text-green-700 border-green-200 dark:border-green-900 dark:text-green-400",
  Codeforces: "bg-blue-500/10 text-blue-700 border-blue-200 dark:border-blue-900 dark:text-blue-400",
  NeetCode: "bg-purple-500/10 text-purple-700 border-purple-200 dark:border-purple-900 dark:text-purple-400",
  Other: "bg-muted text-muted-foreground"
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
      <div className="py-12 text-center border rounded-lg bg-card/60 backdrop-blur-sm shadow-sm">
        <h3 className="text-lg font-medium">No questions found</h3>
        <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or add a new question.</p>
      </div>
    );
  }

  const getRowColor = (confidence: number) => {
    if (confidence <= 2) return "border-l-red-500 bg-red-500/5 hover:bg-red-500/10";
    if (confidence === 3) return "border-l-amber-400 bg-amber-400/5 hover:bg-amber-400/10";
    return "border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10";
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Question</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-center">Confidence</TableHead>
            <TableHead>Next Rev.</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {questions.map((q) => {
              const nextRev = calculateNextRevision(q.lastRevised, q.confidence);
              const overdue = isOverdue(q);

              return (
                <motion.tr 
                  key={q.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group transition-colors border-l-4 border-b ${getRowColor(q.confidence)}`}
                >
                  <TableCell className="pl-6">
                    <button 
                      className="font-semibold text-foreground hover:text-primary transition-colors text-left focus:outline-none"
                      onClick={() => onSelectQuestion(q)}
                      data-testid={`btn-view-${q.id}`}
                    >
                      {q.name}
                    </button>
                    {overdue && (
                      <Badge className="ml-2 animate-pulse bg-red-500 hover:bg-red-600 text-white border-0 text-[10px] py-0 h-5">
                        Revise Now
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {q.platform === "NeetCode" ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-purple-500 font-medium">NeetCode</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className={`${platformColors[q.platform] || platformColors.Other}`}>
                        {q.platform}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {q.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[11px] bg-primary/8 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                          {t}
                        </span>
                      ))}
                      {q.tags.length > 2 && (
                        <span className="text-[11px] bg-primary/8 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                          +{q.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <ConfidenceDots level={q.confidence} />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {format(new Date(nextRev), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onMarkRevised(q)}
                        title="Mark as Revised Today"
                        data-testid={`btn-revise-${q.id}`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Link href={`/edit/${q.id}`} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
  );
}
