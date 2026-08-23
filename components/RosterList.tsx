"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import PlayerBadge from "@/components/PlayerBadge";
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
          className="field"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={group === g ? "chip-active" : "chip"}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="overflow-hidden card-feature">
        {filtered.map((player) => (
          <Link
            key={`${player.id}-${player.jersey}`}
            href={`/roster/${player.id}`}
            className="row-divide flex items-center gap-3 px-4 py-3.5 hover:bg-cream"
          >
            <PlayerBadge
              jersey={player.jersey}
              firstName={player.firstName}
              lastName={player.lastName}
              size="sm"
            />
            <div className="min-w-0 flex-1">
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
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink/40">No players match.</p>
        ) : null}
      </div>
    </div>
  );
}
