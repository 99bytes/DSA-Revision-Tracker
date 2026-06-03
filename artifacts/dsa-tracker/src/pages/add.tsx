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
import { motion } from "framer-motion";

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
    <div className="min-h-[100dvh] bg-background relative z-0 flex flex-col cursor-pointer" onClick={() => setLocation("/")}>
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 dark:bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 dark:bg-cyan-500/10 blur-[120px]" />
      </div>

      <header className="border-b border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-2xl sticky top-0 z-50 shadow-sm cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary h-10 w-10 hover:-translate-x-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Add New Question
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="container max-w-3xl mx-auto px-4 py-8 flex-1 flex flex-col"
      >
        <div className="bg-card/60 backdrop-blur-xl border border-t-white/10 dark:border-t-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <QuestionForm
              onSubmit={handleSubmit}
              onCancel={() => setLocation("/")}
              isSubmitting={createMutation.isPending}
            />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
