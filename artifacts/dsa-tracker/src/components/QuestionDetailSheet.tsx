import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Question } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

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
          <SheetTitle className="text-2xl font-bold tracking-tight">
            {question.name}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{question.platform}</Badge>
            <Badge variant="secondary">Time: {question.timeComplexity}</Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-primary/5">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Approach
            </h3>
            <div className="text-sm bg-muted/50 p-4 rounded-md border whitespace-pre-wrap">
              {question.approach || "No approach recorded."}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Mistake Notes
            </h3>
            <div className="text-sm bg-destructive/5 text-destructive p-4 rounded-md border border-destructive/20 whitespace-pre-wrap">
              {question.mistakeNotes || "No mistake notes recorded."}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
