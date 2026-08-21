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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">News</h2>
        <p className="text-sm text-white/55">Official USC Athletics · open in browser</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        {STORIES.map((s) => (
          <a
            key={s.title}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-b border-white/10 px-4 py-4 last:border-b-0 active:bg-white/5"
          >
            <p className="text-xs text-gold">{s.date}</p>
            <p className="mt-1 font-medium leading-snug">{s.title}</p>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-white/40">
        Full coverage at usctrojans.com
      </p>
    </div>
  );
}
