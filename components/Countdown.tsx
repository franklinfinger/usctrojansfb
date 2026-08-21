"use client";

import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/utils";

export default function Countdown({ targetIso }: { targetIso: string }) {
  const [parts, setParts] = useState(() => countdownParts(targetIso));

  useEffect(() => {
    const id = setInterval(() => setParts(countdownParts(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (parts.past) {
    return (
      <p className="rounded-xl border border-gold/20 bg-gold/10 px-3 py-2 text-center text-sm font-medium text-gold">
        Kickoff time reached
      </p>
    );
  }

  const cells = [
    { label: "Days", value: parts.days },
    { label: "Hrs", value: parts.hours },
    { label: "Min", value: parts.minutes },
    { label: "Sec", value: parts.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-white/8 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-2 py-3 text-center shadow-card"
        >
          <div className="text-2xl font-bold tabular-nums tracking-tight">{c.value}</div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
