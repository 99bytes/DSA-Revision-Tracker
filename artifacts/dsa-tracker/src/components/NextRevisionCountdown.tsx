import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/lib/types";
import { calculateNextRevision, getDashboardStats } from "@/lib/revision";
import { differenceInSeconds, isBefore } from "date-fns";
import { AlertCircle, CalendarClock, Target, Trophy, Clock, Zap, CheckCircle2, Calendar } from "lucide-react";
import { AlienIcon } from "@/components/AlienIcon";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUpdateQuestion, getListQuestionsQueryKey, useCreateRevision } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { RevisionModal } from "./RevisionModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function CircularProgress({
  value,
  max,
  radius,
  center = 100,
  color,
  strokeWidth = 6,
}: {
  value: number;
  max: number;
  radius: number;
  center?: number;
  color: string;
  strokeWidth?: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), max);
  const offset = circumference - (safeValue / max) * circumference;

  return (
    <>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="opacity-10 dark:opacity-20 text-white"
      />
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]"
        style={{
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
        }}
      />
    </>
  );
}

export function NextRevisionCountdown({ questions, stats }: { questions: Question[], stats?: ReturnType<typeof getDashboardStats> }) {
  const [now, setNow] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateMutation = useUpdateQuestion();
  const createRevisionMutation = useCreateRevision();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const nearestQuestion = useMemo(() => {
    if (!questions.length) return null;

    let closest = questions[0];
    let minTime = new Date(calculateNextRevision(closest.lastRevised, closest.confidence)).getTime();

    for (let i = 1; i < questions.length; i++) {
      const q = questions[i];
      const time = new Date(calculateNextRevision(q.lastRevised, q.confidence)).getTime();
      if (time < minTime) {
        minTime = time;
        closest = q;
      }
    }
    return closest;
  }, [questions]);

  if (!nearestQuestion) {
    return (
      <Card className="h-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center p-8 shadow-none min-h-[360px]">
        <CheckCircle2 className="w-12 h-12 text-black/20 dark:text-white/20 mb-4" />
        <h3 className="text-lg font-medium text-black/60 dark:text-white/60 text-center">
          Add questions to start tracking revisions.
        </h3>
      </Card>
    );
  }

  const handleMarkRevised = () => {
    setIsModalOpen(true);
  };

  const handleSelectConfidence = (confidence: number) => {
    if (!nearestQuestion) return;

    const newLastRevised = new Date().toISOString();

    updateMutation.mutate(
      {
        id: nearestQuestion.id,
        data: {
          lastRevised: newLastRevised,
          confidence,
        },
      },
      {
        onSuccess: () => {
          createRevisionMutation.mutate({
            data: {
              questionId: nearestQuestion.id,
              previousConfidence: nearestQuestion.confidence,
              newConfidence: confidence,
            }
          });

          queryClient.invalidateQueries({ queryKey: getListQuestionsQueryKey() });
          setIsModalOpen(false);

          const nextDate = new Date(calculateNextRevision(newLastRevised, confidence as 1 | 2 | 3 | 4 | 5));

          toast({
            title: "Revision Logged Successfully",
            description: `Confidence updated to ${confidence}. Next revision scheduled for ${nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
          });
        },
      }
    );
  };

  const nextRevDate = new Date(calculateNextRevision(nearestQuestion.lastRevised, nearestQuestion.confidence));
  const isOverdueState = isBefore(nextRevDate, now);
  const diffSecs = Math.max(0, differenceInSeconds(nextRevDate, now));

  const days = Math.floor(diffSecs / (3600 * 24));
  const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSecs % 3600) / 60);
  const seconds = diffSecs % 60;

  return (
    <Card className="h-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent backdrop-blur-none rounded-[2rem] relative overflow-hidden shadow-sm dark:shadow-none hover:dark:bg-black/20 hover:backdrop-blur-sm hover:dark:shadow-md hover:dark:border-t-white/20 transition-all duration-300 min-h-[360px] flex flex-col hover:-translate-y-2">

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-base font-bold tracking-wide text-black dark:text-white">Next Revision Countdown</CardTitle>
        </div>
        <div className="hidden sm:flex px-3 py-1 bg-primary/10 text-primary dark:text-primary text-xs font-semibold rounded-full border border-primary/20">
          Upcoming Revision
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 flex flex-col h-full relative z-10">
        <div className="flex-1 flex flex-col xl:flex-row justify-center xl:justify-between items-center gap-6 xl:gap-4 mt-2 mb-4 w-full">

          {isOverdueState ? (
            <div className="flex flex-col items-center justify-center text-center min-h-[200px] flex-1">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-red-500 tracking-tight">Due Now</h2>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative w-[180px] h-[180px] shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                  {/* Outer ring */}
                  <CircularProgress value={days} max={10} radius={85} center={100} color="hsl(var(--ring-1))" strokeWidth={8} />
                  {/* Middle ring */}
                  <CircularProgress value={hours} max={24} radius={70} center={100} color="hsl(var(--ring-2))" strokeWidth={8} />
                  {/* Inner ring */}
                  <CircularProgress value={minutes} max={60} radius={55} center={100} color="hsl(var(--ring-3))" strokeWidth={8} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold tracking-tighter">{String(days).padStart(2, "0")}</span>
                  <span className="text-[10px] font-bold tracking-widest text-ring-1 uppercase mt-1">Days</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-ring-1" style={{ boxShadow: "0 0 8px hsla(var(--ring-1) / 0.5)" }} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold leading-none">{String(hours).padStart(2, "0")}</span>
                    <span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">Hours</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-ring-2" style={{ boxShadow: "0 0 8px hsla(var(--ring-2) / 0.5)" }} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold leading-none">{String(minutes).padStart(2, "0")}</span>
                    <span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">Minutes</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-ring-3" style={{ boxShadow: "0 0 8px hsla(var(--ring-3) / 0.5)" }} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold leading-none">{String(seconds).padStart(2, "0")}</span>
                    <span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">Seconds</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center xl:items-start text-center xl:text-left flex-1 min-w-[40%] xl:pl-4 border-t xl:border-t-0 xl:border-l border-black/10 dark:border-white/10 pt-4 xl:pt-0">
            <p className="text-[10px] font-medium text-black/50 dark:text-white/50 mb-1">Next Question</p>
            <h3 className="text-xl font-bold tracking-tight line-clamp-2 text-black dark:text-white w-full max-w-full mb-3" title={nearestQuestion.name}>
              {nearestQuestion.name}
            </h3>

            <p className="text-[10px] font-medium text-black/50 dark:text-white/50 mb-1">Confidence</p>
            <div className="flex flex-col xl:flex-row items-center gap-3 mb-4">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(idx => {
                  return (
                    <span
                      key={idx}
                      className={cn(
                        "text-base transition-all duration-300",
                        idx < nearestQuestion.confidence
                          ? "opacity-100 text-primary drop-shadow-[0_0_8px_hsla(var(--primary)/0.6)] scale-110"
                          : "opacity-20 text-foreground"
                      )}
                    >
                      <AlienIcon className="w-5 h-5" />
                    </span>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleMarkRevised}
              disabled={updateMutation.isPending}
              size="sm"
              className="mt-2 w-full max-w-[200px] rounded-full magical-btn hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white font-semibold text-xs transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {updateMutation.isPending ? "Marking..." : "Mark as Revised"}
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center sm:items-end w-full gap-4 sm:gap-0">
          <div className="flex items-center text-[12px] text-black/80 dark:text-white/90 font-bold w-full sm:w-auto justify-center sm:justify-start drop-shadow-md">
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Due on {nextRevDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            <span className="mx-2">•</span>
            {nextRevDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </div>

          <div className="flex items-center gap-6 bg-black/5 dark:bg-white/5 rounded-xl px-4 py-2">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold leading-none">{stats?.dueTodayCount ?? 0}</span>
              <span className="text-[9px] font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mt-1">Due Today</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold leading-none">{stats?.dueThisWeekCount ?? 0}</span>
              <span className="text-[9px] font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mt-1">This Week</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-red-600 dark:text-red-400 leading-none">{stats?.overdueCount ?? 0}</span>
              <span className="text-[9px] font-semibold text-red-600/70 dark:text-red-400/70 uppercase tracking-wider mt-1">Overdue</span>
            </div>
          </div>
        </div>
      </CardContent>

      <RevisionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelectConfidence}
      />
    </Card>
  );
}
