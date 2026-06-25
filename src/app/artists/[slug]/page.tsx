"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Package, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetArtistBySlugQuery,
  useGetProductsByArtistIdQuery,
  useAddToCartMutation,
} from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";
function img(src?: string) {
  if (!src) return "/placeholder.png";
  return src.startsWith("http") ? src : `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

interface ArtistProduct {
  _id: string;
  name: string;
  mainImage?: string | string[];
  assets?: { url: string }[];
  pricing?: { salePrice?: number };
  dynamicVariants?: { colorId: string; sizeId: string }[];
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: ArtistProduct; index: number }) {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [addToCart] = useAddToCartMutation();
  const [adding, setAdding] = useState(false);

  const mainImage = Array.isArray(product.mainImage) ? product.mainImage[0] : product.mainImage;
  const image1 = img(product.assets?.[0]?.url ?? mainImage);
  const image2 = img(product.assets?.[1]?.url ?? product.assets?.[0]?.url ?? mainImage);
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
      await addToCart({ productId: product._id, colorId: firstVariant.colorId, sizeId: firstVariant.sizeId, quantity: 1 }).unwrap();
      toast.success("Added to bag!", { id: toastId });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to add";
      toast.error(msg.includes("stock") ? "Please select a variant" : msg, { id: toastId });
      if (msg.includes("stock") || msg.includes("variant")) router.push(link);
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
      <Link href={link} className="block relative overflow-hidden bg-[#d9d9d9]">
        <img src={image1} alt={product.name} className="w-full aspect-[0.78] object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" />
        <img src={image2} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick add */}
        <div className="absolute bottom-3 left-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={handleAddToBag}
            disabled={adding}
            className={`flex items-center text-white rounded-full shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] h-9 overflow-hidden group/btn ${adding ? "bg-emerald-500 w-[120px]" : "bg-[#F42D23] w-9 hover:w-[120px]"}`}
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

      <div className="mt-3">
        <h3 className="text-[#191B1C] text-sm leading-tight line-clamp-1" style={{ fontFamily: "satoshi" }}>{product.name}</h3>
        <p className="text-[#191B1C] text-sm font-semibold mt-1" style={{ fontFamily: "satoshi" }}>
          {price != null ? `₹ ${price.toLocaleString("en-IN")}` : "—"}
        </p>
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
export default function ArtistStorePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: artistData, isLoading: artistLoading } = useGetArtistBySlugQuery(slug ?? "", { skip: !slug });
  const artist = artistData?.data;
  const artistId = artist?._id;

  const { data: productsData, isLoading: productsLoading } = useGetProductsByArtistIdQuery(
    { artistId: artistId ?? "", limit: 50 },
    { skip: !artistId }
  );
  const products: ArtistProduct[] = productsData?.data?.products ?? [];

  const profilePhoto = img(artist?.userId?.profilePhoto);

  if (artistLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center flex-col gap-4">
          <p className="text-xl uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>Artist not found</p>
          <Link href="/artists" className="text-xs text-[#F42D23] uppercase tracking-widest" style={{ fontFamily: "futuraCB" }}>← All Artists</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4F4ED]">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0e1213] min-h-[420px] sm:min-h-[500px] flex items-end">

          {/* Background profile photo */}
          <div className="absolute inset-0">
            <img src={profilePhoto} alt={artist.brandname} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1213] via-[#0e1213]/60 to-transparent" />
          </div>

          {/* Decorative blob */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F42D23]/10 blur-3xl pointer-events-none" />

          <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-10 pt-36 pb-12">

            {/* Back link */}
            <Link href="/artists" className="inline-flex items-center gap-2 text-[#F4F4ED]/40 hover:text-[#F4F4ED] transition-colors mb-8 group">
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "satoshi" }}>All Artists</span>
            </Link>

            <div className="flex items-end gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0">
                <img src={profilePhoto} alt={artist.brandname} className="w-full h-full object-cover" />
              </div>

              <div className="pb-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#F42D23] mb-2" style={{ fontFamily: "satoshi" }}>
                  Dripside Artist
                </p>
                <h1
                  className="text-[#F4F4ED] text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight"
                  style={{ fontFamily: "futuraCB" }}
                >
                  {artist.brandname}
                </h1>
                {artist.userId?.name && (
                  <p className="text-[#F4F4ED]/40 text-sm mt-2" style={{ fontFamily: "satoshi" }}>
                    {artist.userId.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCTS ────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#191B1C] text-[#F4F4ED] flex items-center justify-center">
                <Package size={15} />
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                  Collection
                </h2>
                <p className="text-[10px] text-[#191B1C]/40 uppercase tracking-wider mt-0.5" style={{ fontFamily: "satoshi" }}>
                  {productsLoading ? "Loading…" : `${products.length} piece${products.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#F42D23] hover:text-[#191B1C] transition-colors"
              style={{ fontFamily: "futuraCB" }}
            >
              All Products <ArrowRight size={11} />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#191B1C]/[0.07]">
              <div className="w-16 h-16 rounded-2xl bg-[#191B1C]/[0.04] flex items-center justify-center mb-4">
                <Package size={24} className="text-[#191B1C]/20" />
              </div>
              <p className="text-base uppercase tracking-tight text-[#191B1C] mb-2" style={{ fontFamily: "futuraCB" }}>No products yet</p>
              <p className="text-sm text-[#191B1C]/40 mb-6" style={{ fontFamily: "satoshi" }}>This artist hasn't dropped anything yet. Check back soon.</p>
              <button onClick={() => router.push("/products")} className="px-6 py-3 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-full hover:bg-[#F42D23] transition-colors" style={{ fontFamily: "futuraCB" }}>
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
