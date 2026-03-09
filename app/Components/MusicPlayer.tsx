"use client";

import { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/asset/HarpOfMoon.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Try auto-play immediately
    const tryAutoPlay = () => {
      if (audioRef.current && !hasInteracted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(() => {
          // Browser blocked autoplay, wait for user interaction
          console.log("Auto-play blocked. Waiting for user interaction...");
        });
      }
    };

    // Try auto-play after a short delay
    const timeout = setTimeout(tryAutoPlay, 500);

    // Fallback: play on first user interaction
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(() => {
          // Browser blocked autoplay
        });
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("scroll", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("scroll", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      });
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 box-glow-hover group"
      aria-label={isPlaying ? "Mute music" : "Play music"}
      title={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M9 9H5a1 1 0 00-1 1v4a1 1 0 001 1h4l5 5V4L9 9z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      )}

      {/* Pulse animation when playing */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full border border-primary/40 animate-ping" />
      )}
    </button>
  );
};

export default MusicPlayer;
