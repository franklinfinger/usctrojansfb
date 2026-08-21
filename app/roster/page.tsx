import RosterList from "@/components/RosterList";
import { getRoster } from "@/lib/cfbd";

export default async function RosterPage() {
  const roster = await getRoster();

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="eyebrow">2026 team</p>
        <h1 className="page-title">Roster</h1>
        <p className="page-sub">{roster.length} players · search and filter by position</p>
      </div>
      <RosterList players={roster} />
    </div>
  );
}
