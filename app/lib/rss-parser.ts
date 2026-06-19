export type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
  source: string;
  category: "fashion" | "hiphop" | "general";
};

const FASHION_KEYWORDS = [
  "fashion", "brand", "designer", "collection", "runway", "couture",
  "streetwear", "luxury", "style", "vuitton", "gucci", "chanel", "dior",
  "prada", "balenciaga", "supreme", "off-white", "sneaker", "drop",
  "ファッション", "ブランド", "コレクション",
];

const HIPHOP_KEYWORDS = [
  "hip-hop", "hiphop", "rap", "rapper", "album", "mixtape", "single",
  "drake", "kendrick", "kanye", "travis", "future", "21 savage",
  "playboi", "young thug", "metro boomin", "central cee", "tyler",
  "freestyle", "verse", "feature", "mv", "music video",
];

function extractImage(xml: string): string | null {
  const patterns = [
    /media:content[^>]+url="([^"]+)"/i,
    /media:thumbnail[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]+type="image/i,
    /<img[^>]+src="([^"]+)"/i,
  ];
  for (const pat of patterns) {
    const m = xml.match(pat);
    if (m) return m[1];
  }
  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categorize(title: string, desc: string): RssItem["category"] {
  const text = (title + " " + desc).toLowerCase();
  const fashionScore = FASHION_KEYWORDS.filter((k) => text.includes(k)).length;
  const hiphopScore = HIPHOP_KEYWORDS.filter((k) => text.includes(k)).length;
  if (hiphopScore > fashionScore) return "hiphop";
  if (fashionScore > 0) return "fashion";
  return "general";
}

function parseItems(xml: string, sourceName: string, defaultCategory?: RssItem["category"]): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const titleMatch = block.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = stripHtml(titleMatch ? (titleMatch[1] ?? titleMatch[2] ?? "") : "");

    const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>|<link[^>]*href="([^"]+)"/i);
    const link = (linkMatch ? (linkMatch[1] ?? linkMatch[2] ?? "") : "").trim();

    const descMatch = block.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description[^>]*>([\s\S]*?)<\/description>/i);
    const rawDesc = descMatch ? (descMatch[1] ?? descMatch[2] ?? "") : "";
    const description = stripHtml(rawDesc).slice(0, 200);

    const dateMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
    const pubDate = (dateMatch ? dateMatch[1] : "").trim();

    const imageUrl = extractImage(block) ?? extractImage(rawDesc);

    if (!title || !link) continue;

    const cat = defaultCategory ?? categorize(title, rawDesc);

    items.push({ title, link, description, pubDate, imageUrl, source: sourceName, category: cat });
  }

  return items;
}

type FeedDef = { url: string; name: string; category?: RssItem["category"] };

const FEEDS: FeedDef[] = [
  { url: "https://hypebeast.com/feed", name: "HYPEBEAST" },
  { url: "https://hypebeast.com/music/feed", name: "HYPEBEAST Music", category: "hiphop" },
  { url: "https://wwd.com/feed/", name: "WWD", category: "fashion" },
  { url: "https://www.complex.com/rss/", name: "Complex" },
  { url: "https://www.billboard.com/c/hip-hop/feed/", name: "Billboard Hip-Hop", category: "hiphop" },
];

export async function fetchAllNews(): Promise<RssItem[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CultureFeedBot/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`${feed.name}: ${res.status}`);
      const xml = await res.text();
      return parseItems(xml, feed.name, feed.category);
    })
  );

  const all: RssItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  // Deduplicate by link, sort by date desc
  const seen = new Set<string>();
  return all
    .filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db2 = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db2 - da;
    })
    .slice(0, 100);
}
