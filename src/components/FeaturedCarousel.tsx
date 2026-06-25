'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useGetAllProductsPublicQuery, useAddToCartMutation } from '@/redux/api/UserApi'
import FlipLink from '@/components/ui/FlipLink'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  _id: string
  name: string
  assets?: { url: string }[]
  mainImage?: string | string[]
  pricing?: { salePrice: number }
  artistId?: {
    brandname?: string
    userId?: { profilePhoto?: string; name?: string }
  }
  dynamicVariants?: {
    colorId: string
    sizeId: string
    colorName?: string
    size?: string
  }[]
}

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? ''

function img(src?: string) {
  if (!src) return '/placeholder.png'
  return src.startsWith('http') ? src : `${IMAGE_BASE}/${src.replace(/^\//, '')}`
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useGetAllProductsPublicQuery({ limit: 10 })

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -390 : 390, behavior: 'smooth' })
  }

  const products: Product[] = data?.data?.products ?? []

  return (
    <section id="products" className="w-full bg-[#e8e6e1] py-8 sm:py-10 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 sm:px-8 mb-6">
        <h1
          className="uppercase text-[#111] text-[15vw] sm:text-[4vw] leading-none"
          style={{ fontFamily: 'futuraCB' }}
        >
          FEATURED
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-[#ef4934] flex items-center justify-center text-white hover:scale-105 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-[#ef4934] flex items-center justify-center text-white hover:scale-105 transition-transform"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto px-4 sm:px-8 pb-2
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {/* FOOTER CTA */}
      <div className="px-4 sm:px-8 mt-8">
        <div className="w-fit px-6 py-3 rounded-full bg-[#ef4934] text-white">
          <Link href="/products">
          <FlipLink text="Shop all" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Product card ───────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)
  const [addToCart] = useAddToCartMutation()
  const [adding, setAdding] = useState(false)

  const mainImage = Array.isArray(product.mainImage) ? product.mainImage[0] : product.mainImage
  const image1 = img(product.assets?.[0]?.url ?? mainImage)
  const image2 = img(product.assets?.[1]?.url ?? product.assets?.[0]?.url ?? mainImage)

  const artistName = product.artistId?.brandname ?? product.artistId?.userId?.name
  const artistPhoto = img(product.artistId?.userId?.profilePhoto)
  const price = product.pricing?.salePrice
  const link = `/products/${product._id}`
  const firstVariant = product.dynamicVariants?.[0]

  const handleAddToBag = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
      router.push('/login')
      return
    }

    // No variant info — go to product page to select
    if (!firstVariant?.colorId || !firstVariant?.sizeId) {
      router.push(link)
      return
    }

    setAdding(true)
    const toastId = toast.loading('Adding to bag…')
    try {
      await addToCart({
        productId: product._id,
        colorId: firstVariant.colorId,
        sizeId: firstVariant.sizeId,
        quantity: 1,
      }).unwrap()
      toast.success('Added to bag!', { id: toastId })
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Failed to add'
      if (msg.includes('stock') || msg.includes('variant')) {
        toast.error('Please select a variant', { id: toastId })
        router.push(link)
      } else {
        toast.error(msg, { id: toastId })
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <motion.div
      transition={{ duration: 0.3 }}
      className="shrink-0 w-[86vw] sm:w-[320px] group cursor-pointer"
    >
      {/* IMAGE */}
      <Link href={link} className="block relative overflow-hidden bg-[#d9d9d9]">
        {/* Default image */}
        <img
          src={image1}
          alt={product.name}
          className="w-full aspect-[0.8] object-cover transition-all duration-500 group-hover:opacity-0"
        />

        {/* Hover image */}
        <img
          src={image2}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Artist badge — slides in from left on hover */}
        {artistName && (
          <div className="
            absolute top-4 left-4
            flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-black/30 backdrop-blur-md border border-white/20
            opacity-0 -translate-x-3
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-500
          ">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30 shrink-0">
              <img
                src={artistPhoto}
                alt={artistName}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-white text-[10px] uppercase tracking-wider font-semibold drop-shadow-sm whitespace-nowrap"
              style={{ fontFamily: 'satoshi' }}
            >
              {artistName}
            </span>
          </div>
        )}

        {/* Quick add — slides up from bottom on hover */}
        <div className="
          absolute bottom-4 left-4 z-10
          opacity-0 translate-y-3
          group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-500
        ">
          <button
            onClick={handleAddToBag}
            disabled={adding}
            className={`
              flex items-center text-white rounded-full shadow-2xl
              transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
              h-10 overflow-hidden group/btn
              ${adding ? 'bg-emerald-500 w-[130px]' : 'bg-[#ef4934] w-10 hover:w-[130px]'}
            `}
          >
            <div className="flex items-center justify-center min-w-[40px] h-10">
              <ShoppingBag size={16} strokeWidth={2.5} className={adding ? 'animate-bounce' : ''} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pr-4"
              style={{ fontFamily: 'satoshi' }}
            >
              {adding ? 'Adding…' : 'Add to bag'}
            </span>
          </button>
        </div>
      </Link>

      {/* INFO */}
      <div className="mt-3 px-1">
        <h3
          className="text-[#111] text-sm leading-tight line-clamp-1"
          style={{ fontFamily: 'satoshi' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[#111] text-sm font-semibold" style={{ fontFamily: 'satoshi' }}>
            {price != null ? `₹ ${price.toLocaleString('en-IN')}` : '—'}
          </p>
          <span
            className="text-[9px] uppercase tracking-widest text-[#111]/40"
            style={{ fontFamily: 'satoshi' }}
          >
            New Drop
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="shrink-0 w-[86vw] sm:w-[320px] animate-pulse">
      <div className="w-full aspect-[0.8] bg-[#d0cec9] rounded-sm" />
      <div className="mt-3 px-1 space-y-2">
        <div className="h-3 bg-[#d0cec9] rounded w-3/4" />
        <div className="h-3 bg-[#d0cec9] rounded w-1/3" />
      </div>
    </div>
  )
}
