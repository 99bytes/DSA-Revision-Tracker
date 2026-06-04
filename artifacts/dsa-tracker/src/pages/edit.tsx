import { Link, useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListQuestions,
  useUpdateQuestion,
  getListQuestionsQueryKey,
} from "@workspace/api-client-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { QuestionForm } from "@/components/QuestionForm";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";
import { motion } from "framer-motion";

export default function EditQuestion() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiQuestions = [], isLoading } = useListQuestions();
  const question = (apiQuestions as Question[]).find(
    (q) => q.id === params.id,
  );

  const updateMutation = useUpdateQuestion();

  const handleSubmit = (data: Omit<Question, "id">) => {
    if (!question) return;
    updateMutation.mutate(
      {
        id: question.id,
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
            title: "Question updated",
            description: "Changes saved successfully.",
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

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background bg-[image:var(--theme-bg-image)] bg-cover bg-center bg-fixed flex items-center justify-center text-muted-foreground after:absolute after:inset-0 after:bg-black/40 dark:after:bg-black/40 after:backdrop-blur-[2px] after:-z-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background bg-[image:var(--theme-bg-image)] bg-cover bg-center bg-fixed relative z-0 after:absolute after:inset-0 after:bg-black/40 dark:after:bg-black/40 after:backdrop-blur-[2px] after:-z-10">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 dark:bg-secondary/10 blur-[120px]" />
      </div>

      <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:shadow-none">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary h-10 w-10 hover:-translate-x-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Edit Question
            </h1>
          </div>
          <ThemeSelector />
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="container max-w-3xl mx-auto px-4 py-8"
      >
        <div className="bg-card/60 backdrop-blur-xl border border-t-white/10 dark:border-t-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                Loading question data...
              </div>
            ) : question ? (
              <QuestionForm
                initialData={question as Question}
                onSubmit={handleSubmit}
                onCancel={() => setLocation("/")}
                isSubmitting={updateMutation.isPending}
              />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                Question not found.
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
