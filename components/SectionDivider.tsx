"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Sword divider between page sections. The hairlines and sword are pure CSS
// transitions (see .section-divider* in globals.css); this component's only
// job is toggling the "revealed" class once it scrolls into view.
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
        tone === "dark" ? "text-white/30" : "text-ink/25"
      }`}
    >
      <span className="section-divider-hairline section-divider-hairline-left" />
      <Image
        src="/images/sword.png"
        alt=""
        width={421}
        height={104}
        className="section-divider-sword h-auto w-[200px]"
      />
      <span className="section-divider-hairline section-divider-hairline-right" />
    </div>
  );
}
