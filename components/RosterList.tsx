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
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, number, hometown"
          className="w-full rounded-xl border border-ink/10 bg-cream-card py-3 pl-10 pr-4 text-sm outline-none placeholder:text-ink/30 focus:border-cardinal"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              group === g
                ? "bg-cardinal text-white"
                : "border border-ink/10 bg-cream-card text-ink/55"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/8 bg-cream-card">
        {filtered.map((player) => (
          <Link
            key={`${player.id}-${player.jersey}`}
            href={`/roster/${player.id}`}
            className="flex items-center justify-between border-b border-ink/6 px-4 py-3.5 last:border-b-0 hover:bg-cream"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {player.firstName} {player.lastName}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink/45">
                {player.position ?? "—"}
                {player.year ? ` · ${classYear(player.year)}` : ""}
                {player.height ? ` · ${formatHeight(player.height)}` : ""}
                {player.hometown ? ` · ${player.hometown}` : ""}
              </p>
            </div>
            <span className="ml-3 text-lg font-semibold tabular-nums text-cardinal">
              {player.jersey ?? ""}
            </span>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink/40">No players match.</p>
        ) : null}
      </div>
    </div>
  );
}
