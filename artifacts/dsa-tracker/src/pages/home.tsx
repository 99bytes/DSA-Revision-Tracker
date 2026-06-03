import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListQuestions,
  getListQuestionsQueryKey,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@workspace/api-client-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dashboard } from "@/components/Dashboard";
import { SearchFilter } from "@/components/SearchFilter";
import { QuestionTable } from "@/components/QuestionTable";
import { QuestionDetailSheet } from "@/components/QuestionDetailSheet";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";
import { calculateNextRevision } from "@/lib/revision";

export default function Home() {
  const [search, setSearch] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [sortBy, setSortBy] = useState("nextRev");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiQuestions = [], isLoading } = useListQuestions();

  const questions: Question[] = useMemo(
    () =>
      (apiQuestions as Question[]),
    [apiQuestions],
  );

  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

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

  const handleMarkRevised = (q: Question) => {
    updateMutation.mutate(
      { id: q.id, data: { lastRevised: new Date().toISOString() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListQuestionsQueryKey(),
          });
          toast({
            title: "Question revised",
            description: `Updated revision date for ${q.name}. Next revision scheduled.`,
          });
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
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs tracking-tight shadow-lg">
              DSA
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Revision{" "}
              <span className="text-muted-foreground font-semibold">
                Tracker
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/add"
              className="inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 shadow-md shadow-primary/25"
              data-testid="link-add-question"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Dashboard questions={questions} />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              Your Tracked Questions
            </h2>
            <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-primary/10 text-primary text-xs font-bold">
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

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Loading questions...
            </div>
          ) : (
            <QuestionTable
              questions={filteredAndSortedQuestions}
              onMarkRevised={handleMarkRevised}
              onDelete={handleDelete}
              onSelectQuestion={setSelectedQuestion}
            />
          )}
        </div>
      </main>

      <QuestionDetailSheet
        question={selectedQuestion}
        open={!!selectedQuestion}
        onOpenChange={(open) => !open && setSelectedQuestion(null)}
      />
    </div>
  );
}
