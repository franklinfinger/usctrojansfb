"use client";

import { useState } from "react";
import RankingsTable from "@/components/RankingsTable";
import type { Team } from "@/lib/types";
import type { PollTab } from "@/lib/rankings";

export default function RankingsTabs({ polls, teams }: { polls: PollTab[]; teams: Team[] }) {
  const [active, setActive] = useState<PollTab["key"]>(polls[0]?.key ?? "ap");
  const tab = polls.find((p) => p.key === active) ?? polls[0];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {polls.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setActive(p.key)}
            className={active === p.key ? "chip-active" : "chip"}
          >
            {p.label}
          </button>
        ))}
      </div>

      {tab.weekLabel ? (
        <p className="label-cap">{tab.weekLabel}</p>
      ) : null}

      {tab.rows == null ? (
        tab.key === "cfp" ? (
          <div className="card-feature overflow-hidden">
            <div className="section-dark px-6 py-8">
              <p className="hero-eyebrow">Not yet released</p>
              <h2 className="mt-2 font-serif text-3xl">CFP rankings haven&apos;t started</h2>
              <p className="mt-3 max-w-xl text-sm text-white/75">
                The College Football Playoff selection committee doesn&apos;t publish its first
                rankings until partway through the season, typically early-to-mid November.
                Check the AP Top 25 or Coaches Poll tabs until then.
              </p>
            </div>
          </div>
        ) : (
          <p className="empty-state">Rankings unavailable right now.</p>
        )
      ) : tab.rows.length === 0 ? (
        <p className="empty-state">No ranked teams in this poll yet.</p>
      ) : (
        <RankingsTable rows={tab.rows} teams={teams} />
      )}
    </div>
  );
}
