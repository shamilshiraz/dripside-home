"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetAllProductsPublicQuery, useAddToCartMutation } from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  name: string;
  assets?: { url: string }[];
  mainImage?: string | string[];
  pricing?: { salePrice: number; price?: number };
  artistId?: {
    brandname?: string;
    userId?: { profilePhoto?: string; name?: string };
  };
  dynamicVariants?: {
    colorId: string;
    sizeId: string;
    colorName?: string;
    size?: string;
  }[];
  tags?: string[];
}

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";
function img(src?: string) {
  if (!src) return "/placeholder.png";
  return src.startsWith("http") ? src : `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

function sortProducts(products: Product[], sort: string) {
  const arr = [...products];
  if (sort === "price_asc") return arr.sort((a, b) => (a.pricing?.salePrice ?? 0) - (b.pricing?.salePrice ?? 0));
  if (sort === "price_desc") return arr.sort((a, b) => (b.pricing?.salePrice ?? 0) - (a.pricing?.salePrice ?? 0));
  return arr;
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [addToCart] = useAddToCartMutation();
  const [adding, setAdding] = useState(false);

  const mainImage = Array.isArray(product.mainImage) ? product.mainImage[0] : product.mainImage;
  const image1 = img(product.assets?.[0]?.url ?? mainImage);
  const image2 = img(product.assets?.[1]?.url ?? product.assets?.[0]?.url ?? mainImage);

  const artistName = product.artistId?.brandname ?? product.artistId?.userId?.name;
  const artistPhoto = img(product.artistId?.userId?.profilePhoto);
  const price = product.pricing?.salePrice;
  const link = `/products/${product._id}`;
  const firstVariant = product.dynamicVariants?.[0];

  const handleAddToBag = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) { router.push("/login"); return; }
    if (!firstVariant?.colorId || !firstVariant?.sizeId) { router.push(link); return; }
    setAdding(true);
    const toastId = toast.loading("Adding to bag…");
    try {
      await addToCart({
        productId: product._id,
        colorId: firstVariant.colorId,
        sizeId: firstVariant.sizeId,
        quantity: 1,
      }).unwrap();
      toast.success("Added to bag!", { id: toastId });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to add";
      if (msg.includes("stock") || msg.includes("variant")) {
        toast.error("Please select a variant", { id: toastId });
        router.push(link);
      } else {
        toast.error(msg, { id: toastId });
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <Link href={link} className="block relative overflow-hidden bg-[#d9d9d9]">
        <img
          src={image1}
          alt={product.name}
          className="w-full aspect-[0.78] object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
        />
        <img
          src={image2}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Artist badge */}
        {artistName && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shrink-0">
              <img src={artistPhoto} alt={artistName} className="w-full h-full object-cover" />
            </div>
            <span className="text-white text-[9px] uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: "satoshi" }}>
              {artistName}
            </span>
          </div>
        )}

        {/* Quick add */}
        <div className="absolute bottom-3 left-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={handleAddToBag}
            disabled={adding}
            className={`flex items-center text-white rounded-full shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] h-9 overflow-hidden group/btn ${
              adding ? "bg-emerald-500 w-[120px]" : "bg-[#F42D23] w-9 hover:w-[120px]"
            }`}
          >
            <div className="flex items-center justify-center min-w-[36px] h-9">
              <ShoppingBag size={14} strokeWidth={2.5} className={adding ? "animate-bounce" : ""} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pr-3" style={{ fontFamily: "satoshi" }}>
              {adding ? "Adding…" : "Add to bag"}
            </span>
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-[#191B1C] text-sm leading-tight line-clamp-1" style={{ fontFamily: "satoshi" }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[#191B1C] text-sm font-semibold" style={{ fontFamily: "satoshi" }}>
            {price != null ? `₹ ${price.toLocaleString("en-IN")}` : "—"}
          </p>
          {artistName && (
            <span className="text-[9px] uppercase tracking-widest text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
              {artistName}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[0.78] bg-[#d0cec9]" />
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-[#d0cec9] rounded w-3/4" />
        <div className="h-3 bg-[#d0cec9] rounded w-1/4" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const LIMIT = 24;

export default function AllProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const sortRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data, isLoading, isFetching } = useGetAllProductsPublicQuery({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  });

  const rawProducts: Product[] = data?.data?.products ?? [];
  const total: number = data?.data?.pagination?.total ?? rawProducts.length;
  const totalPages = Math.ceil(total / LIMIT);

  const products = sortProducts(rawProducts, sort);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sort)!;

  const handleClearSearch = useCallback(() => {
    setSearch("");
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4F4ED]">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#191B1C] pt-32 pb-16 px-6 sm:px-10">

          {/* Decorative red blob */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F42D23]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#F42D23]/10 blur-2xl pointer-events-none" />

          <div className="max-w-6xl mx-auto relative">
            <Link href="/" className="inline-flex items-center gap-2 text-[#F4F4ED]/40 hover:text-[#F4F4ED] transition-colors mb-8 group">
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "satoshi" }}>Back to Home</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#F42D23] mb-3" style={{ fontFamily: "satoshi" }}>
                  Dripside Collection
                </p>
                <h1
                  className="text-[#F4F4ED] text-[13vw] sm:text-[5.5rem] lg:text-[7rem] uppercase leading-[0.88] tracking-tight"
                  style={{ fontFamily: "futuraCB" }}
                >
                  All
                  <br />
                  Products
                </h1>
              </div>

              <div className="sm:text-right">
                <p className="text-[#F4F4ED]/40 text-sm max-w-xs leading-relaxed" style={{ fontFamily: "satoshi" }}>
                  Exclusive streetwear drops curated by independent artists. Every piece tells a story.
                </p>
                <p className="text-[#F42D23] text-xs uppercase tracking-widest mt-3" style={{ fontFamily: "futuraCB" }}>
                  {total > 0 ? `${total} pieces available` : "Loading…"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH + FILTER BAR ───────────────────────────────────────────── */}
        <div className="sticky top-[72px] z-40 bg-[#F4F4ED]/90 backdrop-blur-md border-b border-[#191B1C]/[0.07]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">

            {/* Search */}
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#191B1C]/30 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full h-11 pl-10 pr-10 rounded-full bg-white border border-[#191B1C]/10 text-sm text-[#191B1C] placeholder:text-[#191B1C]/25 focus:outline-none focus:ring-2 focus:ring-[#191B1C]/10 focus:border-[#191B1C]/25 transition-all"
                style={{ fontFamily: "satoshi" }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#191B1C]/10 flex items-center justify-center hover:bg-[#191B1C]/20 transition-colors"
                  >
                    <X size={10} className="text-[#191B1C]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className={`flex items-center gap-2 h-11 px-4 rounded-full border text-xs uppercase tracking-wider transition-all ${
                  sortOpen
                    ? "bg-[#191B1C] text-[#F4F4ED] border-[#191B1C]"
                    : "bg-white border-[#191B1C]/10 text-[#191B1C]/60 hover:border-[#191B1C]/25"
                }`}
                style={{ fontFamily: "futuraCB" }}
              >
                <ArrowUpDown size={13} />
                <span className="hidden sm:inline">{activeSort.label}</span>
                <span className="sm:hidden">Sort</span>
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl border border-[#191B1C]/[0.08] shadow-xl overflow-hidden z-50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                          sort === opt.value
                            ? "bg-[#191B1C] text-[#F4F4ED]"
                            : "text-[#191B1C]/60 hover:bg-[#191B1C]/[0.04]"
                        }`}
                        style={{ fontFamily: "futuraCB" }}
                      >
                        {opt.label}
                        {sort === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-[#F42D23]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter icon (visual) */}
            <button className="shrink-0 w-11 h-11 rounded-full bg-white border border-[#191B1C]/10 flex items-center justify-center hover:border-[#191B1C]/25 transition-all text-[#191B1C]/50 hover:text-[#191B1C]">
              <SlidersHorizontal size={15} />
            </button>
          </div>

          {/* Active search chip */}
          <AnimatePresence>
            {debouncedSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-2">
                  <span className="text-[10px] text-[#191B1C]/40 uppercase tracking-wider" style={{ fontFamily: "satoshi" }}>
                    Results for
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191B1C] text-[#F4F4ED]">
                    <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "futuraCB" }}>{debouncedSearch}</span>
                    <button onClick={handleClearSearch}>
                      <X size={9} />
                    </button>
                  </div>
                  {!isLoading && (
                    <span className="text-[10px] text-[#191B1C]/30 uppercase tracking-wider" style={{ fontFamily: "satoshi" }}>
                      {total} found
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── PRODUCT GRID ──────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#191B1C]/[0.04] flex items-center justify-center mb-5">
                <Search size={28} className="text-[#191B1C]/20" />
              </div>
              <p className="text-xl uppercase tracking-tight text-[#191B1C] mb-2" style={{ fontFamily: "futuraCB" }}>
                No products found
              </p>
              <p className="text-sm text-[#191B1C]/40 mb-6" style={{ fontFamily: "satoshi" }}>
                Try a different search term
              </p>
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-full hover:bg-[#F42D23] transition-colors"
                style={{ fontFamily: "futuraCB" }}
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <>
              {/* Count row */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
                  {isFetching ? "Loading…" : `Showing ${products.length} of ${total}`}
                </p>
                <div className="h-px flex-1 bg-[#191B1C]/[0.07] mx-6" />
                <p className="text-[10px] uppercase tracking-widest text-[#191B1C]/25" style={{ fontFamily: "futuraCB" }}>
                  Page {page} / {totalPages || 1}
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-full border border-[#191B1C]/10 flex items-center justify-center text-[#191B1C]/40 hover:border-[#191B1C]/30 hover:text-[#191B1C] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft size={15} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                    .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                      if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === "…" ? (
                        <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[#191B1C]/30 text-sm" style={{ fontFamily: "futuraCB" }}>…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`w-10 h-10 rounded-full text-xs uppercase transition-all ${
                            page === item
                              ? "bg-[#191B1C] text-[#F4F4ED]"
                              : "border border-[#191B1C]/10 text-[#191B1C]/50 hover:border-[#191B1C]/30 hover:text-[#191B1C]"
                          }`}
                          style={{ fontFamily: "futuraCB" }}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-full border border-[#191B1C]/10 flex items-center justify-center text-[#191B1C]/40 hover:border-[#191B1C]/30 hover:text-[#191B1C] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft size={15} className="rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
