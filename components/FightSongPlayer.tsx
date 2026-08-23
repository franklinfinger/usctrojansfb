"use client";

import { useRef, useState } from "react";

export default function FightSongPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Playback can be rejected (e.g. the browser still resolving the
        // request); the button simply stays in its current state.
      });
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  }

  function handleEnded() {
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
    setPlaying(false);
    setProgress(0);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <audio
        ref={audioRef}
        src="/trojan.mp3"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause Fight On" : "Play Fight On"}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-cardinal text-gold-bright shadow-elevated transition hover:bg-cardinal-soft active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <rect x="7" y="5" width="4" height="14" rx="1" />
            <rect x="13" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M8,5 L19,12 L8,19 Z" />
          </svg>
        )}
      </button>

      <div className="h-1 w-48 overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center">
        <p className="font-serif text-lg text-white">Fight On</p>
        <p className="label-cap mt-0.5 text-white/50">USC Fight Song</p>
      </div>
    </div>
  );
}
