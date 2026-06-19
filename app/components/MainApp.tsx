"use client";

import { useState, useMemo } from "react";
import { fashionBrands, type FashionBrand } from "@/app/data/fashion-brands";
import { hipHopArtists, type HipHopArtist } from "@/app/data/hiphop";

type Tab = "fashion" | "hiphop";

const STATUS_COLORS: Record<FashionBrand["status"], string> = {
  Active: "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50",
  Transition: "bg-amber-900/60 text-amber-300 border border-amber-700/50",
  "New Chapter": "bg-blue-900/60 text-blue-300 border border-blue-700/50",
  Dropped: "bg-zinc-800 text-zinc-400 border border-zinc-600/50",
  Rising: "bg-purple-900/60 text-purple-300 border border-purple-700/50",
  Growing: "bg-rose-900/60 text-rose-300 border border-rose-700/50",
};

const CATEGORY_COLORS: Record<string, string> = {
  メゾン: "bg-yellow-900/40 text-yellow-300",
  ハイブランド: "bg-orange-900/40 text-orange-300",
  コンテンポラリー: "bg-cyan-900/40 text-cyan-300",
  コラボ: "bg-pink-900/40 text-pink-300",
  マスプレミアム: "bg-violet-900/40 text-violet-300",
  新興ブランド: "bg-lime-900/40 text-lime-300",
  インディペンデント: "bg-teal-900/40 text-teal-300",
  ストリートウェア: "bg-zinc-700/40 text-zinc-300",
};

function FashionCard({ brand }: { brand: FashionBrand }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[brand.category] ?? "bg-zinc-800 text-zinc-300";
  const statusColor = STATUS_COLORS[brand.status];

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-white font-bold text-lg leading-tight">{brand.name}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusColor}`}>
          {brand.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${catColor}`}>{brand.category}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{brand.country}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{brand.season}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-zinc-500 text-xs">CD</span>
        <span className="text-zinc-300 text-sm font-medium">{brand.creativeDirector}</span>
      </div>

      <p className={`text-zinc-400 text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
        {brand.summary}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-zinc-500 hover:text-white transition-colors"
        >
          {expanded ? "▲ 閉じる" : "▼ 続きを読む"}
        </button>
        <a
          href={`https://www.instagram.com/${brand.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-pink-400 transition-colors"
        >
          {brand.instagram}
        </a>
      </div>
    </article>
  );
}

function HipHopCard({ artist }: { artist: HipHopArtist }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-white font-bold text-lg leading-tight">{artist.name}</h2>
        {artist.isJune2026 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/70 text-red-300 border border-red-700/50 whitespace-nowrap">
            🔴 June 2026
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{artist.country}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300">{artist.genre}</span>
      </div>

      <div className="bg-zinc-800/60 rounded-xl p-3 flex flex-col gap-1.5">
        <div className="flex gap-2">
          <span className="text-zinc-500 text-xs w-16 shrink-0">最新作</span>
          <span className="text-zinc-200 text-xs font-medium">{artist.latestRelease}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-zinc-500 text-xs w-16 shrink-0">日付</span>
          <span className="text-zinc-300 text-xs">{artist.releaseDate}</span>
        </div>
        {artist.features !== "未発表" && artist.features !== "全曲ソロ" && (
          <div className="flex gap-2">
            <span className="text-zinc-500 text-xs w-16 shrink-0">Feat.</span>
            <span className="text-zinc-400 text-xs">{artist.features}</span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="text-zinc-500 text-xs w-16 shrink-0">Single</span>
          <span className="text-zinc-400 text-xs">{artist.latestSingle}</span>
        </div>
      </div>

      <p className={`text-zinc-400 text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
        {artist.summary}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-zinc-500 hover:text-white transition-colors"
        >
          {expanded ? "▲ 閉じる" : "▼ 続きを読む"}
        </button>
        <div className="flex gap-3">
          <a href={artist.spotify} target="_blank" rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-green-400 transition-colors">▶ Spotify</a>
          <a href={artist.instagram} target="_blank" rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-pink-400 transition-colors">IG</a>
          <a href={artist.youtube} target="_blank" rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors">YT</a>
        </div>
      </div>
    </article>
  );
}

export default function MainApp() {
  const [tab, setTab] = useState<Tab>("fashion");
  const [search, setSearch] = useState("");

  const filteredBrands = useMemo(() => {
    const q = search.toLowerCase();
    return fashionBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.creativeDirector.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredArtists = useMemo(() => {
    const q = search.toLowerCase();
    return hipHopArtists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        a.latestRelease.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }, [search]);

  const june2026Count = hipHopArtists.filter((a) => a.isJune2026).length;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <h1 className="text-white font-black text-xl tracking-tight">CULTURE FEED</h1>
            <span className="text-zinc-500 text-xs">2026.06</span>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="ブランド / アーティスト / CDを検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />

          {/* Tab switcher */}
          <div className="flex mt-3 bg-zinc-900 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("fashion")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "fashion"
                  ? "bg-yellow-400 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              👔 FASHION
              <span className="ml-1.5 text-xs opacity-70">{filteredBrands.length}</span>
            </button>
            <button
              onClick={() => setTab("hiphop")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "hiphop"
                  ? "bg-red-500 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🎤 HIP-HOP
              <span className="ml-1.5 text-xs opacity-70">{filteredArtists.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">
        {tab === "fashion" && (
          <>
            {search === "" && (
              <p className="text-zinc-600 text-xs mb-4">
                メゾン〜新興ブランドまで {fashionBrands.length} ブランドの最新情報
              </p>
            )}
            <div className="flex flex-col gap-3">
              {filteredBrands.map((brand) => (
                <FashionCard key={brand.name} brand={brand} />
              ))}
              {filteredBrands.length === 0 && (
                <p className="text-zinc-600 text-sm text-center py-12">検索結果なし</p>
              )}
            </div>
          </>
        )}

        {tab === "hiphop" && (
          <>
            {search === "" && (
              <div className="mb-4 bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs font-semibold">
                  🔴 June 2026 新着 {june2026Count} 件
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  D12・YG・Vince Staples・Freddie Gibbs・Blxst・Future 新作発表
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {filteredArtists.map((artist) => (
                <HipHopCard key={artist.name} artist={artist} />
              ))}
              {filteredArtists.length === 0 && (
                <p className="text-zinc-600 text-sm text-center py-12">検索結果なし</p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-zinc-700 text-xs py-4 border-t border-zinc-900">
        Source: HYPEBEAST / WWD / Billboard / Complex — Updated 2026.06.19
      </footer>
    </div>
  );
}
