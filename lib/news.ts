export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

const FEED_URL =
  "https://news.google.com/rss/search?q=%22USC+Trojans%22+football&hl=en-US&gl=US&ceid=US:en";

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 1800 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    const items = blocks
      .map((block): NewsItem | null => {
        const link = extractTag(block, "link");
        const pubDate = extractTag(block, "pubDate");
        const source = extractTag(block, "source");

        let title = extractTag(block, "title");
        // Google News formats titles as "Headline - Source Name"; the
        // source is already broken out into its own tag, so trim the
        // redundant suffix rather than showing it twice in the UI.
        if (source && title.endsWith(` - ${source}`)) {
          title = title.slice(0, title.length - source.length - 3);
        }

        if (!title || !link) return null;
        return { title, link, pubDate, source: source || "Google News" };
      })
      .filter((item): item is NewsItem => item !== null);

    return items
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 20);
  } catch {
    return [];
  }
}
