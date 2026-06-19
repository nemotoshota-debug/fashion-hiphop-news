"use client";

import { useState, useMemo } from "react";
import { fashionBrands, type FashionBrand } from "@/app/data/fashion-brands";
import { hipHopArtists, type HipHopArtist } from "@/app/data/hiphop";

type Tab = "fashion" | "hiphop";

const STATUS_COLORS: Record<FashionBrand["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
  Transition: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
  "New Chapter": "bg-blue-500/15 text-blue-300 border border-blue-500/25",
  Dropped: "bg-white/5 text-white/40 border border-white/10",
  Rising: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
  Growing: "bg-rose-500/15 text-rose-300 border border-rose-500/25",
};

const CATEGORY_COLORS: Record<string, string> = {
  メゾン: "bg-yellow-400/10 text-yellow-300/90 border border-yellow-400/20",
  ハイブランド: "bg-orange-400/10 text-orange-300/90 border border-orange-400/20",
  コンテンポラリー: "bg-cyan-400/10 text-cyan-300/90 border border-cyan-400/20",
  コラボ: "bg-pink-400/10 text-pink-300/90 border border-pink-400/20",
  マスプレミアム: "bg-violet-400/10 text-violet-300/90 border border-violet-400/20",
  新興ブランド: "bg-lime-400/10 text-lime-300/90 border border-lime-400/20",
  インディペンデント: "bg-teal-400/10 text-teal-300/90 border border-teal-400/20",
  ストリートウェア: "bg-white/5 text-white/60 border border-white/10",
};

function FashionCard({ brand }: { brand: FashionBrand }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[brand.category] ?? "bg-white/5 text-white/60 border border-white/10";
  const statusColor = STATUS_COLORS[brand.status];

  return (
    <article className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-white/90 font-semibold text-base leading-snug tracking-wide">{brand.name}</h2>
        <span className={`text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap backdrop-blur-sm ${statusColor}`}>
          {brand.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={`text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm ${catColor}`}>{brand.category}</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/[0.06]">{brand.country}</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/[0.06]">{brand.season}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white/25 text-xs tracking-widest uppercase">CD</span>
        <span className="text-white/70 text-sm">{brand.creativeDirector}</span>
      </div>

      <p className={`text-white/40 text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
        {brand.summary}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-white/25 hover:text-white/60 transition-colors"
        >
          {expanded ? "↑ 閉じる" : "↓ 続きを読む"}
        </button>
        <a
          href={`https://www.instagram.com/${brand.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/25 hover:text-pink-300/80 transition-colors"
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
    <article className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-white/90 font-semibold text-base leading-snug tracking-wide">{artist.name}</h2>
        {artist.isJune2026 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/25 whitespace-nowrap">
            June 2026
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/[0.06]">{artist.country}</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300/80 border border-blue-500/20">{artist.genre}</span>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-1.5">
        <div className="flex gap-3">
          <span className="text-white/25 text-xs w-14 shrink-0 tracking-wider">LATEST</span>
          <span className="text-white/75 text-xs font-medium">{artist.latestRelease}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-white/25 text-xs w-14 shrink-0 tracking-wider">DATE</span>
          <span className="text-white/50 text-xs">{artist.releaseDate}</span>
        </div>
        {artist.features !== "未発表" && artist.features !== "全曲ソロ" && (
          <div className="flex gap-3">
            <span className="text-white/25 text-xs w-14 shrink-0 tracking-wider">FEAT.</span>
            <span className="text-white/40 text-xs">{artist.features}</span>
          </div>
        )}
        <div className="flex gap-3">
          <span className="text-white/25 text-xs w-14 shrink-0 tracking-wider">SINGLE</span>
          <span className="text-white/40 text-xs">{artist.latestSingle}</span>
        </div>
      </div>

      <p className={`text-white/40 text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
        {artist.summary}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-white/25 hover:text-white/60 transition-colors"
        >
          {expanded ? "↑ 閉じる" : "↓ 続きを読む"}
        </button>
        <div className="flex gap-4">
          <a href={artist.spotify} target="_blank" rel="noopener noreferrer"
            className="text-xs text-white/25 hover:text-green-300/80 transition-colors">Spotify</a>
          <a href={artist.instagram} target="_blank" rel="noopener noreferrer"
            className="text-xs text-white/25 hover:text-pink-300/80 transition-colors">IG</a>
          <a href={artist.youtube} target="_blank" rel="noopener noreferrer"
            className="text-xs text-white/25 hover:text-red-300/80 transition-colors">YT</a>
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
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 20% 0%, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)" }}>

      {/* Ambient light blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-72 h-72 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/30 backdrop-blur-2xl border-b border-white/[0.06] px-4 pt-5 pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-baseline gap-2.5 mb-3">
            <h1 className="text-white font-light text-2xl tracking-[0.2em] uppercase">Culture Feed</h1>
            <span className="text-white/20 text-xs tracking-widest">2026.06</span>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
          />

          {/* Tab switcher */}
          <div className="flex mt-3 bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("fashion")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium tracking-[0.15em] uppercase transition-all ${
                tab === "fashion"
                  ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              Fashion
              <span className="ml-2 opacity-50">{filteredBrands.length}</span>
            </button>
            <button
              onClick={() => setTab("hiphop")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium tracking-[0.15em] uppercase transition-all ${
                tab === "hiphop"
                  ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              Hip-Hop
              <span className="ml-2 opacity-50">{filteredArtists.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        {tab === "fashion" && (
          <>
            {search === "" && (
              <p className="text-white/15 text-xs tracking-widest uppercase mb-4">
                {fashionBrands.length} Brands
              </p>
            )}
            <div className="flex flex-col gap-3">
              {filteredBrands.map((brand) => (
                <FashionCard key={brand.name} brand={brand} />
              ))}
              {filteredBrands.length === 0 && (
                <p className="text-white/20 text-sm text-center py-16 tracking-widest">NO RESULTS</p>
              )}
            </div>
          </>
        )}

        {tab === "hiphop" && (
          <>
            {search === "" && (
              <div className="mb-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl px-4 py-3">
                <p className="text-white/50 text-xs tracking-widest uppercase">
                  June 2026 — {june2026Count} New Releases
                </p>
                <p className="text-white/25 text-xs mt-1">
                  D12 · YG · Vince Staples · Freddie Gibbs · Blxst · Future
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {filteredArtists.map((artist) => (
                <HipHopCard key={artist.name} artist={artist} />
              ))}
              {filteredArtists.length === 0 && (
                <p className="text-white/20 text-sm text-center py-16 tracking-widest">NO RESULTS</p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-white/10 text-xs py-5 border-t border-white/[0.04] tracking-widest uppercase">
        Hypebeast · WWD · Billboard · Complex
      </footer>
    </div>
  );
}
