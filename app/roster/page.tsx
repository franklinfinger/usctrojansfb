import { getRoster } from "@/lib/cfbd";

export default async function RosterPage() {
  const roster = await getRoster();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">2026 Roster</h2>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {roster.map((player) => (
          <div
            key={`${player.id}-${player.jersey}`}
            className="flex items-center justify-between border-b border-white/10 px-4 py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium">
                {player.firstName} {player.lastName}
              </p>
              <p className="text-sm text-white/55">
                {player.position ?? "—"}
                {player.hometown ? ` · ${player.hometown}` : ""}
              </p>
            </div>
            <span className="text-gold">{player.jersey ?? ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
