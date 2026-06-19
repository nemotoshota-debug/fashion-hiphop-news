"use client";

import { type RssItem } from "@/app/lib/rss-parser";

const SOURCE_COLORS: Record<string, string> = {
  "HYPEBEAST": "text-orange-300/70",
  "HYPEBEAST Music": "text-orange-300/70",
  "WWD": "text-blue-300/70",
  "Complex": "text-yellow-300/70",
  "Billboard Hip-Hop": "text-green-300/70",
};

function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(raw));
  } catch {
    return raw.slice(0, 16);
  }
}

export function NewsCard({ item }: { item: RssItem }) {
  const srcColor = SOURCE_COLORS[item.source] ?? "text-white/40";

  return (
    <article className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col">
      {item.imageUrl && (
        <div className="relative h-40 overflow-hidden bg-white/[0.03]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-medium tracking-widest uppercase ${srcColor}`}>{item.source}</span>
          <span className="text-white/20 text-xs">{formatDate(item.pubDate)}</span>
        </div>

        <h3 className="text-white/90 font-semibold text-sm leading-snug line-clamp-2">{item.title}</h3>

        {item.description && (
          <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{item.description}</p>
        )}

        <div className="pt-2 mt-auto border-t border-white/[0.06]">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/80 transition-colors"
          >
            <span>記事を読む</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
