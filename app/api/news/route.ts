import { fetchAllNews, type RssItem } from "@/app/lib/rss-parser";
import { translateBatch } from "@/app/lib/translate";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category") as RssItem["category"] | "all" | null;

  try {
    const all = await fetchAllNews();
    const filtered = cat && cat !== "all" ? all.filter((i) => i.category === cat) : all;

    const titles = await translateBatch(filtered.map((i) => i.title));
    const descs = await translateBatch(filtered.map((i) => i.description));

    const translated = filtered.map((item, idx) => ({
      ...item,
      title: titles[idx] ?? item.title,
      description: descs[idx] ?? item.description,
    }));

    return Response.json({ items: translated, updatedAt: new Date().toISOString() });
  } catch (err) {
    return Response.json({ error: String(err), items: [], updatedAt: new Date().toISOString() }, { status: 500 });
  }
}
