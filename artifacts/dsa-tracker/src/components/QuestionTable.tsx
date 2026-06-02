import { Question } from "@/lib/types";
import { calculateNextRevision, isOverdue } from "@/lib/revision";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

interface QuestionTableProps {
  questions: Question[];
  onMarkRevised: (q: Question) => void;
  onDelete: (id: string) => void;
  onSelectQuestion: (q: Question) => void;
}

export function QuestionTable({ questions, onMarkRevised, onDelete, onSelectQuestion }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg bg-card">
        <h3 className="text-lg font-medium">No questions found</h3>
        <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or add a new question.</p>
      </div>
    );
  }

  const getRowColor = (confidence: number) => {
    if (confidence <= 2) return "bg-destructive/10 hover:bg-destructive/20";
    if (confidence === 3) return "bg-yellow-500/10 hover:bg-yellow-500/20";
    return "bg-green-500/10 hover:bg-green-500/20";
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-center">Confidence</TableHead>
            <TableHead>Next Rev.</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                  className={`group transition-colors ${getRowColor(q.confidence)} border-b`}
                >
                  <TableCell>
                    <button 
                      className="font-medium text-left hover:underline focus:outline-none focus:underline"
                      onClick={() => onSelectQuestion(q)}
                      data-testid={`btn-view-${q.id}`}
                    >
                      {q.name}
                    </button>
                    {overdue && (
                      <Badge variant="destructive" className="ml-2 py-0 h-5 text-[10px]">
                        Revise Now
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-background">{q.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {q.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                          {t}
                        </span>
                      ))}
                      {q.tags.length > 2 && (
                        <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                          +{q.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {q.confidence}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(nextRev), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary/80"
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
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
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
