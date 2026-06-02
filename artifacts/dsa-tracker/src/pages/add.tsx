import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuestionForm } from "@/components/QuestionForm";
import { ArrowLeft } from "lucide-react";
import { addQuestion } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";

export default function AddQuestion() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Question, "id">) => {
    const newQuestion: Question = {
      ...data,
      id: crypto.randomUUID()
    };
    addQuestion(newQuestion);
    toast({
      title: "Question added",
      description: "Successfully added to your tracker."
    });
    setLocation("/");
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-10 w-10">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Add New Question</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-card border rounded-lg p-6">
          <QuestionForm 
            onSubmit={handleSubmit}
            onCancel={() => setLocation("/")}
          />
        </div>
      </main>
    </div>
  );
}
