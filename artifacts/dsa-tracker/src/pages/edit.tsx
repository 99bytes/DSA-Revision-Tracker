import { Link, useLocation, useParams } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuestionForm } from "@/components/QuestionForm";
import { ArrowLeft } from "lucide-react";
import { getQuestions, updateQuestion } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";
import { useEffect, useState } from "react";

export default function EditQuestion() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!params.id) return;
    const q = getQuestions().find(q => q.id === params.id);
    if (q) {
      setQuestion(q);
    } else {
      setLocation("/");
    }
  }, [params.id, setLocation]);

  const handleSubmit = (data: Omit<Question, "id">) => {
    if (!question) return;
    const updated: Question = {
      ...data,
      id: question.id
    };
    updateQuestion(updated);
    toast({
      title: "Question updated",
      description: "Changes saved successfully."
    });
    setLocation("/");
  };

  if (!question) return null; // loading

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-10 w-10">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Edit Question</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-card border rounded-lg p-6">
          <QuestionForm 
            initialData={question}
            onSubmit={handleSubmit}
            onCancel={() => setLocation("/")}
          />
        </div>
      </main>
    </div>
  );
}
