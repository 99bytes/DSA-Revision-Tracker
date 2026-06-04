import { Monitor, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { id: "light", name: "Light Mode", colors: ["#F8FAFC", "#8B5CF6", "#FFFFFF"] },
  { id: "dark", name: "Beatle Original", colors: ["#000000", "#A78BFA", "#080808"] },
  { id: "github-dark", name: "GitHub Dark", colors: ["#0D1117", "#58A6FF", "#161B22"] },
  { id: "terminal-hacker", name: "Hacker's Terminal", colors: ["#050505", "#00FF88", "#0A0A0A"] },
  { id: "leetcode-elite", name: "LeetCode Elite", colors: ["#111827", "#FFA116", "#1F2937"] },
  { id: "cyberpunk", name: "Cyberpunk", colors: ["#050014", "#9D4EDD", "#120024"] },
  { id: "harry-potter", name: "Harry Potter", colors: ["#230C0F", "#F5B800", "#750002"] },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Palette className="h-[1.2rem] w-[1.2rem] transition-all text-foreground" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-background border-border shadow-xl">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center justify-between cursor-pointer rounded-xl px-2 py-2 mb-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:bg-black/5 dark:focus:bg-white/5 focus:text-foreground"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <Monitor className="w-4 h-4 opacity-70" />
            <span>System / Auto</span>
          </div>
          {theme === "system" && <span className="w-2 h-2 rounded-full bg-primary" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/50" />

        <div className="flex flex-col gap-0.5 mt-1">
          {THEMES.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-center justify-between cursor-pointer rounded-xl px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:bg-black/5 dark:focus:bg-white/5 focus:text-foreground"
            >
              <span className="text-sm font-medium">{t.name}</span>
              <div className="flex gap-1 items-center">
                <div className="flex -space-x-1">
                  {t.colors.map((c, i) => (
                    <span 
                      key={i} 
                      className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shadow-sm relative z-[3] first:z-[1] last:z-[2]"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {theme === t.id && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-primary animate-in zoom-in" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
