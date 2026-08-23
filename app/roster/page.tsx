import PageHero from "@/components/PageHero";
import RosterList from "@/components/RosterList";
import { getRoster } from "@/lib/cfbd";

export default async function RosterPage() {
  const roster = await getRoster();

  return (
    <>
      <PageHero
        eyebrow="2026 team"
        title="Roster"
        subtitle={`${roster.length} players · search and filter by position`}
      />
      <div className="page-shell-wide">
        <RosterList players={roster} />
      </div>
    </>
  );
}
