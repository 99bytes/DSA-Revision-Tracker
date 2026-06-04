import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AlienIcon } from "@/components/AlienIcon";
import { cn } from "@/lib/utils";

interface RevisionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (confidence: number) => void;
}

const confidenceLevels = [
  { value: 1, label: "Forgot Completely" },
  { value: 2, label: "Remembered a Little" },
  { value: 3, label: "Remembered Most of It" },
  { value: 4, label: "Solved with Minor Struggle" },
  { value: 5, label: "Solved Easily" },
];

export function RevisionModal({ isOpen, onOpenChange, onSelect }: RevisionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-center text-black dark:text-white">
            How well did you remember this question?
          </DialogTitle>
          <DialogDescription className="text-center text-black/60 dark:text-white/60 mt-2 font-medium">
            Your answer will update the confidence level and schedule the next revision.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          {confidenceLevels.map((level) => (
            <motion.button
              key={level.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(level.value)}
              className="w-full relative flex items-center justify-between p-4 rounded-2xl bg-black/[0.03] hover:bg-black/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.08] border border-transparent hover:border-primary/30 transition-colors group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="font-bold text-sm z-10 text-black dark:text-white">{level.label}</span>

              <div className="flex items-center gap-0.5 z-10">
                {[0, 1, 2, 3, 4].map(idx => {
                  return (
                    <span
                      key={idx}
                      className={cn(
                        "text-lg transition-all duration-300",
                        idx < level.value 
                          ? "opacity-100 text-primary drop-shadow-[0_0_8px_hsla(var(--primary)/0.6)] scale-110" 
                          : "opacity-20 text-foreground"
                      )}
                    >  <AlienIcon className="w-5 h-5" />
                    </span>
                  );
                })}
              </div>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
