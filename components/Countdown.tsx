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
    return <p className="text-sm text-gold">Kickoff time reached</p>;
  }

  const cells = [
    { label: "Days", value: parts.days },
    { label: "Hrs", value: parts.hours },
    { label: "Min", value: parts.minutes },
    { label: "Sec", value: parts.seconds },
  ];

  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div key={c.label} className="rounded-xl bg-black/30 px-2 py-2 text-center">
          <div className="text-xl font-bold tabular-nums">{c.value}</div>
          <div className="text-[10px] uppercase tracking-wide text-white/60">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
