import { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Plus, LogOut } from "lucide-react";
import { AlienIcon } from "@/components/AlienIcon";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/react";
import { motion } from "framer-motion";
import {
  useListQuestions,
  getListQuestionsQueryKey,
  useUpdateQuestion,
  useDeleteQuestion,
  useCreateRevision,
} from "@workspace/api-client-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { MusicButton } from "@/components/MusicButton";
import { Dashboard } from "@/components/Dashboard";
import { SearchFilter } from "@/components/SearchFilter";
import { QuestionTable } from "@/components/QuestionTable";
import { QuestionDetailSheet } from "@/components/QuestionDetailSheet";
import { useToast } from "@/hooks/use-toast";
import { Question, CONFIDENCE_LABELS } from "@/lib/types";
import { calculateNextRevision } from "@/lib/revision";
import { RevisionModal } from "@/components/RevisionModal";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Home() {
  const { theme } = useTheme();
  const isBrownTheme = theme === "harry-potter" || theme === "leetcode-elite";

  const [search, setSearch] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [sortBy, setSortBy] = useState("nextRev");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [revisionQuestion, setRevisionQuestion] = useState<Question | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { signOut } = useClerk();
  const { user } = useUser();

  const { data: apiQuestions = [], isLoading } = useListQuestions();

  const questions: Question[] = useMemo(
    () =>
      (apiQuestions as Question[]),
    [apiQuestions],
  );

  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();
  const createRevisionMutation = useCreateRevision();

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    questions.forEach((q) => q.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [questions]);

  const filteredAndSortedQuestions = useMemo(() => {
    let result = [...questions];

    if (search) {
      result = result.filter((q) =>
        q.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (confidenceFilter !== "All") {
      result = result.filter(
        (q) => q.confidence.toString() === confidenceFilter,
      );
    }
    if (platformFilter !== "All") {
      result = result.filter((q) => q.platform === platformFilter);
    }
    if (tagFilter !== "All") {
      result = result.filter((q) => q.tags.includes(tagFilter));
    }

    result.sort((a, b) => {
      if (sortBy === "nextRev") {
        const nextA = new Date(
          calculateNextRevision(a.lastRevised, a.confidence),
        ).getTime();
        const nextB = new Date(
          calculateNextRevision(b.lastRevised, b.confidence),
        ).getTime();
        return nextA - nextB;
      }
      if (sortBy === "confidenceAsc") return a.confidence - b.confidence;
      if (sortBy === "confidenceDesc") return b.confidence - a.confidence;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [questions, search, confidenceFilter, platformFilter, tagFilter, sortBy]);

  const handleMarkRevisedClick = (q: Question) => {
    setRevisionQuestion(q);
  };

  const confirmRevision = (confidence: number) => {
    if (!revisionQuestion) return;
    updateMutation.mutate(
      { id: revisionQuestion.id, data: { lastRevised: new Date().toISOString(), confidence: confidence as any } },
      {
        onSuccess: () => {
          createRevisionMutation.mutate({
            data: {
              questionId: revisionQuestion.id,
              previousConfidence: revisionQuestion.confidence,
              newConfidence: confidence,
            }
          });

          queryClient.invalidateQueries({
            queryKey: getListQuestionsQueryKey(),
          });
          toast({
            title: "Question revised",
            description: `Updated revision date for ${revisionQuestion.name}. Next revision scheduled.`,
          });
          setRevisionQuestion(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListQuestionsQueryKey(),
          });
          toast({ title: "Question deleted", variant: "destructive" });
        },
      },
    );
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50 dark:bg-background bg-[image:var(--theme-bg-image)] bg-cover bg-center bg-fixed overflow-hidden relative z-0 after:absolute after:inset-0 after:bg-black/40 dark:after:bg-black/40 after:backdrop-blur-[2px] after:-z-10">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 hidden dark:block">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <header className="shrink-0 bg-white/60 dark:bg-black/20 backdrop-blur-md z-50 shadow-sm dark:shadow-none border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlienIcon className="w-9 h-9 shrink-0 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            <h1 className="hidden sm:block text-xl font-extrabold tracking-tight text-black dark:text-white">
              Beatle
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <MusicButton />
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-black/70 dark:text-white/70 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary dark:text-primary font-bold text-[10px]">
                  {(user.firstName?.[0] ?? user.emailAddresses?.[0]?.emailAddress?.[0] ?? "U").toUpperCase()}
                </div>
                <span className="font-semibold text-black dark:text-white text-xs">{user.firstName ?? user.emailAddresses?.[0]?.emailAddress}</span>
              </div>
            )}
            <button
              onClick={() => signOut({ redirectUrl: basePath || "/" })}
              className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors h-9 w-9 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <Link
              href="/add"
              className={cn(
                "inline-flex items-center justify-center rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 hover:scale-105 h-10 w-10 sm:w-auto p-0 sm:py-2 sm:px-6 shadow-md border-0 shrink-0",
                isBrownTheme 
                  ? "bg-[#5c3e21] hover:bg-[#4a3219] dark:bg-[#5c3e21] dark:hover:bg-[#4a3219] text-[#fde68a] dark:text-[#fde68a] border border-amber-900/50"
                  : "bg-black hover:bg-black/80 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-white dark:text-black"
              )}
              data-testid="link-add-question"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Question</span>
            </Link>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-1 flex flex-col overflow-y-auto container mx-auto px-4"
      >
        <div className="shrink-0 pt-8 pb-1 space-y-10">
          <Dashboard questions={questions} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-5 relative"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold tracking-tight text-black dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Your Tracked Questions
              </h2>
              <span className="inline-flex items-center justify-center h-6 min-w-6 px-2.5 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white text-xs font-black shadow-none">
                {filteredAndSortedQuestions.length}
              </span>
            </div>

            <SearchFilter
              search={search}
              setSearch={setSearch}
              confidenceFilter={confidenceFilter}
              setConfidenceFilter={setConfidenceFilter}
              platformFilter={platformFilter}
              setPlatformFilter={setPlatformFilter}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availableTags={availableTags}
            />
          </motion.div>
        </div>

        <div className="flex-1 min-h-0 pb-8">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Loading questions...
            </div>
          ) : (
            <QuestionTable
              questions={filteredAndSortedQuestions}
              onMarkRevised={handleMarkRevisedClick}
              onDelete={handleDelete}
              onSelectQuestion={setSelectedQuestion}
            />
          )}
        </div>
      </motion.main>

      <QuestionDetailSheet
        question={selectedQuestion}
        open={!!selectedQuestion}
        onOpenChange={(open) => !open && setSelectedQuestion(null)}
      />

      <RevisionModal
        isOpen={!!revisionQuestion}
        onOpenChange={(open) => !open && setRevisionQuestion(null)}
        onSelect={(confidence) => confirmRevision(confidence)}
      />
    </div>
  );
}
