"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { RosterPlayer } from "@/lib/types";
import { classYear, formatHeight } from "@/lib/utils";

const GROUPS = ["All", "QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P", "LS"] as const;

function matchesGroup(pos: string | null, group: string) {
  if (group === "All") return true;
  if (!pos) return false;
  const p = pos.toUpperCase();
  if (group === "OL") return ["OL", "OT", "OG", "C", "IOL", "G", "T"].some((x) => p.includes(x));
  if (group === "DL") return ["DL", "DE", "DT", "NT", "EDGE"].some((x) => p.includes(x));
  if (group === "LB") return ["LB", "ILB", "OLB", "MLB"].some((x) => p.includes(x));
  if (group === "DB") return ["DB", "CB", "S", "SAF", "FS", "SS"].some((x) => p.includes(x));
  return p.includes(group);
}

export default function RosterList({ players }: { players: RosterPlayer[] }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string>("All");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return players.filter((p) => {
      if (!matchesGroup(p.position, group)) return false;
      if (!query) return true;
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        name.includes(query) ||
        String(p.jersey ?? "").includes(query) ||
        (p.hometown ?? "").toLowerCase().includes(query)
      );
    });
  }, [players, q, group]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, number, hometown"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-white/30 focus:border-gold/40"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              group === g
                ? "bg-cardinal text-white shadow-glow"
                : "border border-white/10 bg-white/[0.04] text-white/60"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="glass-strong overflow-hidden rounded-2xl">
        {filtered.map((player) => (
          <Link
            key={`${player.id}-${player.jersey}`}
            href={`/roster/${player.id}`}
            className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 last:border-b-0 active:bg-white/[0.04]"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {player.firstName} {player.lastName}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/45">
                {player.position ?? "—"}
                {player.year ? ` · ${classYear(player.year)}` : ""}
                {player.height ? ` · ${formatHeight(player.height)}` : ""}
                {player.hometown ? ` · ${player.hometown}` : ""}
              </p>
            </div>
            <span className="ml-3 text-lg font-bold tabular-nums text-gold">
              {player.jersey ?? ""}
            </span>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/40">No players match.</p>
        ) : null}
      </div>
    </div>
  );
}
