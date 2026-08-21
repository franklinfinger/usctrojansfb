import RosterList from "@/components/RosterList";
import { getRoster } from "@/lib/cfbd";

export default async function RosterPage() {
  const roster = await getRoster();

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-10 md:px-8">
      <div>
        <p className="eyebrow">2026 team</p>
        <h2 className="mt-1 font-serif text-4xl">Roster</h2>
        <p className="mt-1 text-sm text-ink/50">{roster.length} players</p>
      </div>
      <RosterList players={roster} />
    </div>
  );
}
