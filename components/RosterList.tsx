"use client";

import Link from "next/link";
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
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, number, hometown"
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold"
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
              group === g ? "bg-cardinal text-white" : "bg-white/10 text-white/70"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        {filtered.map((player) => (
          <Link
            key={`${player.id}-${player.jersey}`}
            href={`/roster/${player.id}`}
            className="flex items-center justify-between border-b border-white/10 px-4 py-3 last:border-b-0 active:bg-white/5"
          >
            <div>
              <p className="font-medium">
                {player.firstName} {player.lastName}
              </p>
              <p className="text-sm text-white/55">
                {player.position ?? "—"}
                {player.year ? ` · ${classYear(player.year)}` : ""}
                {player.height ? ` · ${formatHeight(player.height)}` : ""}
                {player.hometown ? ` · ${player.hometown}` : ""}
              </p>
            </div>
            <span className="text-lg font-semibold text-gold">{player.jersey ?? ""}</span>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-white/50">No players match.</p>
        ) : null}
      </div>
    </div>
  );
}
