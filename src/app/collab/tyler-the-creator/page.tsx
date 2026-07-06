"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useGetAllProductsPublicQuery, useAddToCartMutation } from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlipLink from "@/components/ui/FlipLink";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  name: string;
  assets?: { url: string }[];
  mainImage?: string | string[];
  pricing?: { salePrice: number };
  artistId?: {
    brandname?: string;
    userId?: { profilePhoto?: string; name?: string };
  };
  dynamicVariants?: { colorId: string; sizeId: string }[];
}

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";
function img(src?: string) {
  if (!src) return "/placeholder.png";
  return src.startsWith("http") ? src : `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

const FEATURED_LIMIT = 8;

export default function TylerCollabLandingPage() {
  const { data, isLoading } = useGetAllProductsPublicQuery({ limit: FEATURED_LIMIT });
  const products: Product[] = data?.data?.products ?? [];

  return (
    <>
      <Navbar />
      <div className="bg-[#F4F4ED]">
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/tybg.webp" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#191B1C] via-black/30 to-black/20" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 pt-28">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#F4F4ED]/50 hover:text-[#F4F4ED] transition-colors group"
              >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "satoshi" }}>
                  Back to Home
                </span>
              </Link>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <p
                className="text-[#F42D23] text-[10px] uppercase tracking-[0.4em] mb-4"
                style={{ fontFamily: "satoshi" }}
              >
                A Dripside Collaboration
              </p>
              <h1
                className="text-[#F4F4ED] uppercase leading-[0.88] text-[15vw] sm:text-[7vw]"
                style={{ fontFamily: "futuraCB" }}
              >
                Tyler
                <br />
                The Creator
              </h1>
              <p
                className="text-[#F4F4ED]/60 text-sm sm:text-base max-w-md mt-6 leading-relaxed"
                style={{ fontFamily: "satoshi" }}
              >
                A limited-run capsule built on raw color, camp aesthetics, and
                unfiltered creative expression. Once it&apos;s gone, it&apos;s gone.
              </p>

              <a href="#featured" className="mt-10 px-8 py-3 rounded-full bg-[#F42D23] text-[#F4F4ED]">
                <FlipLink text="Shop Now" />
              </a>
            </div>
          </div>
        </section>

        {/* ── STORY STRIP ───────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-[#191B1C]/[0.07]">
          {[
            { n: "01", t: "Limited Run", d: "Every piece is numbered and produced in a capped quantity — no restocks." },
            { n: "02", t: "Original Art", d: "Graphics developed exclusively for this drop, not reused from prior collections." },
            { n: "03", t: "Direct Collab", d: "Designed in partnership with the artist, not licensed after the fact." },
          ].map((item) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#F42D23] text-xs" style={{ fontFamily: "futuraCB" }}>{item.n}</span>
              <h3 className="text-[#191B1C] uppercase text-lg mt-2 mb-2" style={{ fontFamily: "futuraCB" }}>
                {item.t}
              </h3>
              <p className="text-[#191B1C]/50 text-sm leading-relaxed" style={{ fontFamily: "satoshi" }}>
                {item.d}
              </p>
            </motion.div>
          ))}
        </section>

        {/* ── FEATURED GRID ─────────────────────────────────────────────────── */}
        <section id="featured" className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="flex items-end justify-between mb-10">
            <h2
              className="text-[#191B1C] uppercase text-[10vw] sm:text-[3.5vw] leading-none"
              style={{ fontFamily: "futuraCB" }}
            >
              The Drop
            </h2>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-[#191B1C]/50 hover:text-[#191B1C] transition-colors group"
            >
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "satoshi" }}>
                View all products
              </span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-[#191B1C]/40 text-sm" style={{ fontFamily: "satoshi" }}>
              No products available right now — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-16 sm:hidden">
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#191B1C] text-[#F4F4ED]">
              <FlipLink text="View all products" />
            </Link>
          </div>
        </section>

        {/* ── CTA BAND ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#191B1C] py-24 px-6 text-center">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#F42D23]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#F42D23]/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2
              className="text-[#F4F4ED] uppercase text-[10vw] sm:text-[4vw] leading-[0.9] mb-6"
              style={{ fontFamily: "futuraCB" }}
            >
              Don&apos;t sleep
              <br />
              on this one
            </h2>
            <Link href="/products" className="inline-block px-8 py-3 rounded-full bg-[#F42D23] text-[#F4F4ED]">
              <FlipLink text="Shop the full collection" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group cursor-pointer"
    >
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
