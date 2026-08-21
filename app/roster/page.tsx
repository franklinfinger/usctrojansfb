import RosterList from "@/components/RosterList";
import { getRoster } from "@/lib/cfbd";

export default async function RosterPage() {
  const roster = await getRoster();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">2026 Roster</h2>
        <p className="text-sm text-white/55">{roster.length} players</p>
      </div>
      <RosterList players={roster} />
    </div>
  );
}
