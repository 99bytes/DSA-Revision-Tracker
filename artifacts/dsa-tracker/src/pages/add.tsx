import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateQuestion,
  getListQuestionsQueryKey,
} from "@workspace/api-client-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuestionForm } from "@/components/QuestionForm";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";

export default function AddQuestion() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateQuestion();

  const handleSubmit = (data: Omit<Question, "id">) => {
    createMutation.mutate(
      {
        data: {
          name: data.name,
          platform: data.platform,
          tags: data.tags,
          approach: data.approach,
          timeComplexity: data.timeComplexity,
          confidence: data.confidence,
          lastRevised: data.lastRevised,
          mistakeNotes: data.mistakeNotes,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListQuestionsQueryKey(),
          });
          toast({
            title: "Question added",
            description: "Successfully added to your tracker.",
          });
          setLocation("/");
        },
        onError: () => {
          toast({
            title: "Failed to save",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-10 w-10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">
              Add New Question
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-card border rounded-lg p-6">
          <QuestionForm
            onSubmit={handleSubmit}
            onCancel={() => setLocation("/")}
            isSubmitting={createMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}
