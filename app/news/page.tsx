const STORIES = [
  {
    title: "USC QB Jayden Maiava Named to Walter Camp Player of the Year Preseason Watch List",
    date: "Aug 17, 2026",
    href: "https://usctrojans.com/sports/football/archives",
  },
  {
    title: "Bloom Football Performance Center Opens a New Era for USC Football",
    date: "Aug 6, 2026",
    href: "https://usctrojans.com/sports/football",
  },
  {
    title: "USC and Notre Dame to Renew Rivalry in Four-Game Series",
    date: "Aug 3, 2026",
    href: "https://usctrojans.com/sports/football/archives",
  },
  {
    title: "Official USC Football home",
    date: "Ongoing",
    href: "https://usctrojans.com/sports/football",
  },
];

export default function NewsPage() {
  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="eyebrow">Briefing</p>
        <h1 className="page-title">News</h1>
        <p className="page-sub">Official USC Athletics · opens in a new tab</p>
      </div>

      <div className="card overflow-hidden">
        {STORIES.map((s) => (
          <a
            key={s.title}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-b border-ink/6 px-5 py-4 last:border-b-0 hover:bg-cream"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cardinal">
              {s.date}
            </p>
            <p className="mt-1 font-medium leading-snug text-ink">{s.title}</p>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-ink-faint">Full coverage at usctrojans.com</p>
    </div>
  );
}
