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
      <p className="rounded-lg bg-cardinal/10 px-3 py-2 text-center text-sm font-semibold text-cardinal">
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
          className="rounded-xl border border-ink/8 bg-cream px-2 py-3 text-center"
        >
          <div className="text-2xl font-semibold tabular-nums text-ink">{c.value}</div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
