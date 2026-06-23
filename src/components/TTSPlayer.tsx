"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface TTSPlayerProps {
  topic: string;
  slug: string;
  title: string;
}

export function TTSPlayer({ topic, slug, title }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Initialize Audio & Playback
  const handlePlayClick = async () => {
    if (audioUrl) {
      setShowPlayer(true);
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          ?.play()
          .catch((err) => console.error("Playback error:", err));
        setIsPlaying(true);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, slug }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate audio");
      }

      setAudioUrl(data.audioUrl);
      setShowPlayer(true);

      // Create new HTML5 audio element
      const audio = new Audio(data.audioUrl);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      // Event Listeners
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      // Play audio
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronize playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Synchronize mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeedToggle = () => {
    const rates = [0.5, 1, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercentage = clickX / width;
    const newTime = newPercentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setShowPlayer(false);
  };

  return (
    <>
      {/* Listening button trigger inline */}
      <div className="flex flex-col gap-1 items-start">
        <button
          type="button"
          onClick={handlePlayClick}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-550 dark:text-purple-400" />
          ) : isPlaying && showPlayer ? (
            <Pause className="w-3.5 h-3.5 text-purple-550 dark:text-purple-400 fill-purple-550 dark:fill-purple-400" />
          ) : (
            <Play className="w-3.5 h-3.5 text-purple-550 dark:text-purple-400 fill-purple-550 dark:fill-purple-400" />
          )}
          <span>
            {isLoading
              ? "Preparing audio..."
              : isPlaying && showPlayer
                ? "Pause Listening"
                : "Listen to Chapter"}
          </span>
        </button>
        {error && (
          <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>
        )}
      </div>

      {/* Floating Glassmorphic Audio Controller */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[480px] rounded-2xl border border-zinc-200/85 dark:border-zinc-800/85 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg shadow-2xl p-4 flex flex-col gap-3 text-zinc-900 dark:text-zinc-100"
          >
            {/* Title and Close */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="truncate">
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                    Now Playing (TTS)
                  </span>
                  <span className="text-xs font-semibold truncate block">
                    {title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Controls & Speed / Volume */}
            <div className="flex items-center justify-between gap-4">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={handlePlayClick}
                className="w-10 h-10 rounded-full bg-purple-650 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 transition-all shrink-0 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-4.5 h-4.5 fill-white text-white" />
                ) : (
                  <Play className="w-4.5 h-4.5 fill-white text-white translate-x-0.5" />
                )}
              </button>

              {/* Progress and Duration (Centered column) */}
              <div className="flex-1 flex flex-col gap-1.5">
                {/* Custom Seek Bar */}
                <div
                  ref={progressRef}
                  onClick={handleProgressBarClick}
                  role="slider"
                  aria-valuenow={currentTime}
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (!audioRef.current || duration === 0) return;
                    if (e.key === "ArrowLeft") {
                      const newTime = Math.max(0, currentTime - 5);
                      audioRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    } else if (e.key === "ArrowRight") {
                      const newTime = Math.min(duration, currentTime + 5);
                      audioRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    }
                  }}
                  aria-label="Seek audio"
                  className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div
                    className="h-full bg-purple-655 dark:bg-purple-500 transition-all duration-100"
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Speed & Mute controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Speed Selector */}
                <button
                  type="button"
                  onClick={handleSpeedToggle}
                  className="px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-bold font-mono transition-colors cursor-pointer"
                  title="Change playback speed"
                >
                  {playbackRate}x
                </button>

                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
