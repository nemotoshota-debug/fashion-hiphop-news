import { fetchAllNews, type RssItem } from "@/app/lib/rss-parser";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category") as RssItem["category"] | "all" | null;

  try {
    const all = await fetchAllNews();
    const filtered = cat && cat !== "all" ? all.filter((i) => i.category === cat) : all;
    return Response.json({ items: filtered, updatedAt: new Date().toISOString() });
  } catch (err) {
    return Response.json({ error: String(err), items: [], updatedAt: new Date().toISOString() }, { status: 500 });
  }
}
