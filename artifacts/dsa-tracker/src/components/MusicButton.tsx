import { useState, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";

// Use a singleton audio instance so it persists across page navigations
// without duplicating or ghost-playing when components unmount.
let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = true;

export function MusicButton() {
  // Use state to trigger re-renders, but sync with globalIsPlaying
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const { theme } = useTheme();

  useEffect(() => {
    // Only initialize the global audio once
    if (!globalAudio) {
      const audioUrl = `${import.meta.env.BASE_URL}harry_potter_theme.mp3`;
      globalAudio = new Audio(audioUrl);
      globalAudio.loop = true;
      globalAudio.volume = 0.4;
    }

    if (theme === 'harry-potter' && isPlaying) {
      // Browser might block autoplay until user interacts
      globalAudio.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
        globalIsPlaying = false;
      });
    } else {
      globalAudio.pause();
    }
  }, [theme, isPlaying]);

  // Sync state changes to global
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    globalIsPlaying = nextState;
  };

  if (theme !== 'harry-potter') {
    return null; // Only show in Harry Potter theme
  }

  return (
    <button
      onClick={togglePlay}
      className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors h-9 w-9 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
      title={isPlaying ? "Pause Music" : "Play Theme Music"}
    >
      {isPlaying ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}
