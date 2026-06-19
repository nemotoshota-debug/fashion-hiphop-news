"use client";

import { useState, useEffect, useCallback } from "react";
import { type RssItem } from "@/app/lib/rss-parser";
import { NewsCard } from "./NewsCard";

const AUTO_REFRESH_MS = 60 * 60 * 1000; // 1 hour

type Props = {
  category: "fashion" | "hiphop";
};

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export function NewsSection({ category }: Props) {
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/news?category=${category}&t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setUpdatedAt(data.updatedAt ?? null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category]);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(), AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-white/20 text-xs tracking-widest mb-4">NETWORK ERROR</p>
        <button onClick={() => load(true)} className="text-xs text-white/30 hover:text-white/70 transition-colors border border-white/10 rounded-lg px-4 py-2">
          再試行
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/15 text-xs tracking-widest uppercase">
          {items.length} Articles
        </p>
        <div className="flex items-center gap-3">
          {updatedAt && (
            <span className="text-white/15 text-xs">
              {new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(updatedAt))} 更新
            </span>
          )}
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="text-xs text-white/20 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={refreshing ? "animate-spin" : ""}
            >
              <path d="M10 6A4 4 0 1 1 6 2M6 2L8 0M6 2L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{refreshing ? "更新中..." : "更新"}</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-white/20 text-sm text-center py-16 tracking-widest">NO NEWS</p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <NewsCard key={item.link} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
