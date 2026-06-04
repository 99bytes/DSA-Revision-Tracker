import { useState, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";

let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = true;
let listeners: ((playing: boolean) => void)[] = [];

export function initAudio(baseUrl: string) {
  if (!globalAudio) {
    const audioUrl = `${baseUrl}harry_potter_theme.mp3`;
    globalAudio = new Audio(audioUrl);
    globalAudio.loop = true;
    globalAudio.volume = 0.4;
  }
}

export function playHpTheme(baseUrl: string) {
  initAudio(baseUrl);
  globalIsPlaying = true;
  listeners.forEach(l => l(true));
  globalAudio?.play().catch((err) => {
    console.error("Audio playback failed:", err);
    globalIsPlaying = false;
    listeners.forEach(l => l(false));
  });
}

export function stopHpTheme() {
  globalIsPlaying = false;
  listeners.forEach(l => l(false));
  globalAudio?.pause();
}

export function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const { theme } = useTheme();

  useEffect(() => {
    const handleStateChange = (state: boolean) => setIsPlaying(state);
    listeners.push(handleStateChange);
    return () => {
      listeners = listeners.filter(l => l !== handleStateChange);
    };
  }, []);

  useEffect(() => {
    if (theme === 'harry-potter') {
      if (globalIsPlaying) {
        playHpTheme(import.meta.env.BASE_URL);
      }
    } else {
      stopHpTheme();
    }
  }, [theme]);

  const togglePlay = () => {
    if (isPlaying) {
      stopHpTheme();
    } else {
      playHpTheme(import.meta.env.BASE_URL);
    }
  };

  if (theme !== 'harry-potter') {
    return null;
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
