import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Question } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ConfidenceDots } from "./QuestionTable";
import { calculateNextRevision } from "@/lib/revision";
import { format } from "date-fns";

export function QuestionDetailSheet({
  question,
  open,
  onOpenChange
}: {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!question) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold tracking-tight flex items-center justify-between">
            {question.name}
            <div className="bg-muted px-3 py-1 rounded-full"><ConfidenceDots level={question.confidence} /></div>
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-background">{question.platform}</Badge>
            <Badge variant="secondary">Time: {question.timeComplexity}</Badge>
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Last Revised</span>
            <span className="font-medium">{format(new Date(question.lastRevised), "MMM d, yyyy")}</span>
          </div>
          <div className="w-px bg-border"></div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Next Revision</span>
            <span className="font-medium text-primary">{format(new Date(calculateNextRevision(question.lastRevised, question.confidence)), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-primary/8 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Approach
            </h3>
            <div className="text-sm bg-muted p-4 rounded-xl font-mono text-xs leading-relaxed border whitespace-pre-wrap">
              {question.approach || "No approach recorded."}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Mistake Notes
            </h3>
            <div className="text-sm bg-destructive/8 text-foreground p-4 rounded-xl border border-destructive/25 border-l-4 border-l-destructive whitespace-pre-wrap leading-relaxed">
              {question.mistakeNotes || "No mistake notes recorded."}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
