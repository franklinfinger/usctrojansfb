"use client";

import { useEffect, useRef, useState } from "react";

// Sword-sweep divider between page sections. The blade and line are pure CSS
// transitions (see .section-divider* in globals.css); this component's only
// job is toggling the "revealed" class once the divider scrolls into view.
export default function SectionDivider({ tone = "light" }: { tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`section-divider ${revealed ? "is-revealed" : ""} ${
        tone === "dark" ? "text-white/25" : "text-ink/25"
      }`}
    >
      <span className="section-divider-line" />
      <svg
        className={`section-divider-blade ${tone === "dark" ? "text-gold-bright" : "text-gold-ink"}`}
        viewBox="0 0 120 24"
        fill="currentColor"
      >
        <rect x="4" y="9" width="7" height="7" rx="1.5" />
        <rect x="12" y="7" width="3" height="11" rx="1" />
        <path d="M16,9.5 L98,11 L114,12 L98,13 L16,14.5 Z" />
      </svg>
    </div>
  );
}
