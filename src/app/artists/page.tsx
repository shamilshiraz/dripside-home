"use client";

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, Users, X } from "lucide-react";
import { useGetActiveArtistsQuery } from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";

function img(src?: string) {
  if (!src) return "/placeholder.png";
  return src.startsWith("http") ? src : `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

function slugify(val: string) {
  return val.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

interface Artist {
  _id: string;
  brandname: string;
  slug?: string;
  bio?: string;
  userId?: {
    profilePhoto?: string;
    name?: string;
  };
}

// ── Artist Card ───────────────────────────────────────────────────────────────
function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const photo = img(artist.userId?.profilePhoto);
  const slug = artist.slug || slugify(artist.brandname || "artist");
  const href = `/artists/${slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.45) }}
    >
      <Link href={href} className="group block cursor-pointer">
        {/* Photo */}
        <div className="relative overflow-hidden bg-[#1a1c1d] h-[380px] sm:h-[420px]">
          <img
            src={photo}
            alt={artist.brandname}
            className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
          />

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Hover overlay content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <p className="text-[#F4F4ED]/60 text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "satoshi" }}>
              {artist.userId?.name ?? ""}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[#F4F4ED] text-sm uppercase tracking-tight" style={{ fontFamily: "futuraCB" }}>
                {artist.brandname}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F42D23] flex items-center justify-center shrink-0">
                <ArrowRight size={14} className="text-white" />
              </div>
            </div>
          </div>

          {/* "New" badge placeholder — visible always */}
          <div className="absolute top-3 left-3">
            <span className="text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white/80" style={{ fontFamily: "futuraCB" }}>
              Active
            </span>
          </div>
        </div>

        {/* Info below card */}
        <div className="mt-3">
          <h3
            className="text-[#191B1C] text-sm uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-[#F42D23] transition-colors duration-300"
            style={{ fontFamily: "futuraCB" }}
          >
            {artist.brandname}
          </h3>
          {artist.userId?.name && (
            <p className="text-[#191B1C]/40 text-[10px] mt-0.5 line-clamp-1" style={{ fontFamily: "satoshi" }}>
              {artist.userId.name}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[380px] sm:h-[420px] bg-[#d0cec9]" />
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-[#d0cec9] rounded w-2/3" />
        <div className="h-2.5 bg-[#d0cec9] rounded w-1/2" />
      </div>
    </div>
  );
}

// ── Inner page (needs useSearchParams) ───────────────────────────────────────
function ArtistsPageInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when ?focus=search
  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      const t = setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 120);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  const { data, isLoading, isError } = useGetActiveArtistsQuery({ limit: 100 });

  const allArtists: Artist[] = data?.data?.artists ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return allArtists;
    const q = search.toLowerCase();
    return allArtists.filter(
      (a) => a.brandname?.toLowerCase().includes(q) || a.userId?.name?.toLowerCase().includes(q)
    );
  }, [allArtists, search]);

  const handleClear = useCallback(() => {
    setSearch("");
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4F4ED]">

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0e1213] pt-32 pb-16 px-6 sm:px-10">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F42D23]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#F42D23]/8 blur-2xl pointer-events-none" />

          {/* Faint large background text */}
          <p
            className="absolute right-4 bottom-2 text-[18vw] sm:text-[10vw] uppercase leading-none text-white/[0.03] select-none pointer-events-none"
            style={{ fontFamily: "futuraCB" }}
          >
            ARTISTS
          </p>

          <div className="max-w-6xl mx-auto relative">
            <Link href="/" className="inline-flex items-center gap-2 text-[#F4F4ED]/40 hover:text-[#F4F4ED] transition-colors mb-8 group">
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "satoshi" }}>Back to Home</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#F42D23] mb-3" style={{ fontFamily: "satoshi" }}>
                  Dripside Collective
                </p>
                <h1
                  className="text-[#F4F4ED] text-[13vw] sm:text-[5.5rem] lg:text-[7rem] uppercase leading-[0.88] tracking-tight"
                  style={{ fontFamily: "futuraCB" }}
                >
                  Explore
                  <br />
                  Artists
                </h1>
              </div>

              <div className="sm:text-right">
                <p className="text-[#F4F4ED]/40 text-sm max-w-xs leading-relaxed" style={{ fontFamily: "satoshi" }}>
                  Independent creators pushing boundaries through wearable art. Each brand tells its own story.
                </p>
                <p className="text-[#F42D23] text-xs uppercase tracking-widest mt-3" style={{ fontFamily: "futuraCB" }}>
                  {isLoading ? "Loading…" : `${allArtists.length} active creators`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ──────────────────────────────────────────────── */}
        <div className="sticky top-[86px] z-40 bg-[#F4F4ED]/90 backdrop-blur-md border-b border-[#191B1C]/[0.07]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">

            <div className="flex-1 relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#191B1C]/30 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artists or brands…"
                className="w-full h-11 pl-10 pr-10 rounded-full bg-white border border-[#191B1C]/10 text-sm text-[#191B1C] placeholder:text-[#191B1C]/25 focus:outline-none focus:ring-2 focus:ring-[#191B1C]/10 focus:border-[#191B1C]/25 transition-all"
                style={{ fontFamily: "satoshi" }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#191B1C]/10 flex items-center justify-center hover:bg-[#191B1C]/20 transition-colors"
                  >
                    <X size={10} className="text-[#191B1C]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Count chip */}
            <div className="shrink-0 flex items-center gap-2 px-4 h-11 rounded-full bg-white border border-[#191B1C]/10">
              <Users size={13} className="text-[#191B1C]/40" />
              <span className="text-xs text-[#191B1C]/50 uppercase tracking-wider" style={{ fontFamily: "futuraCB" }}>
                {filtered.length}
              </span>
            </div>
          </div>

          {/* Active search chip */}
          <AnimatePresence>
            {search && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-2">
                  <span className="text-[10px] text-[#191B1C]/40 uppercase tracking-wider" style={{ fontFamily: "satoshi" }}>Results for</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191B1C] text-[#F4F4ED]">
                    <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "futuraCB" }}>{search}</span>
                    <button onClick={handleClear}><X size={9} /></button>
                  </div>
                  <span className="text-[10px] text-[#191B1C]/30 uppercase tracking-wider" style={{ fontFamily: "satoshi" }}>
                    {filtered.length} found
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── GRID ────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#191B1C]/[0.04] flex items-center justify-center mb-4">
                <Users size={24} className="text-[#191B1C]/20" />
              </div>
              <p className="text-lg uppercase tracking-tight text-[#191B1C] mb-2" style={{ fontFamily: "futuraCB" }}>Failed to load artists</p>
              <p className="text-sm text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>Please try again later</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#191B1C]/[0.04] flex items-center justify-center mb-5">
                <Search size={28} className="text-[#191B1C]/20" />
              </div>
              <p className="text-xl uppercase tracking-tight text-[#191B1C] mb-2" style={{ fontFamily: "futuraCB" }}>No artists found</p>
              <p className="text-sm text-[#191B1C]/40 mb-6" style={{ fontFamily: "satoshi" }}>Try a different search term</p>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-full hover:bg-[#F42D23] transition-colors"
                style={{ fontFamily: "futuraCB" }}
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <>
              {/* Count row */}
              <div className="flex items-center mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 shrink-0" style={{ fontFamily: "satoshi" }}>
                  {filtered.length} creator{filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="h-px flex-1 bg-[#191B1C]/[0.07] ml-6" />
              </div>

              {/* Artist grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {filtered.map((artist, i) => (
                  <ArtistCard key={artist._id} artist={artist} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Export wrapped in Suspense ────────────────────────────────────────────────
export default function ArtistsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
      </div>
    }>
      <ArtistsPageInner />
    </Suspense>
  );
}
