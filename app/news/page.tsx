import PageHero from "@/components/PageHero";
import { getNews } from "@/lib/news";

function formatPubDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <PageHero eyebrow="Briefing" title="News" subtitle="Latest USC Trojans football coverage · opens in a new tab" />
      <div className="page-shell-wide space-y-6">
        {news.length === 0 ? (
          <p className="empty-state">News temporarily unavailable.</p>
        ) : (
          <div className="card-feature overflow-hidden">
            {news.map((item) => (
              <a
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="row-divide block px-5 py-4 hover:bg-cream"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cardinal">
                  {formatPubDate(item.pubDate)}
                  {item.source ? ` · ${item.source}` : ""}
                </p>
                <p className="mt-1 font-medium leading-snug text-ink">{item.title}</p>
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-ink-faint">Full coverage at usctrojans.com</p>
      </div>
    </>
  );
}
