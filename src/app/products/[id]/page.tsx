'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
  ArrowLeft,
  Loader,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { RootState } from '@/redux/store'
import { useGetProductByIdQuery, useAddToCartMutation } from '@/redux/api/UserApi'
import Navbar from '@/components/Navbar'
import ZoomImage from '@/components/ui/ZoomImage'

// ── Types ─────────────────────────────────────────────────────────────────────
interface IVariant {
  colorId: string
  colorName: string
  colorCode: string
  sizeId: string
  size: string
  stock: number
  price: number
}

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? ''
function img(src?: string) {
  if (!src) return '/placeholder.png'
  return src.startsWith('http') ? src : `${IMAGE_BASE}/${src.replace(/^\//, '')}`
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)

  const { data: productData, isLoading, error } = useGetProductByIdQuery(id, { skip: !id })
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColorId, setSelectedColorId] = useState('')
  const [selectedSizeId, setSelectedSizeId] = useState('')
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  const product = productData?.data

  const variants = useMemo<IVariant[]>(() => product?.dynamicVariants ?? [], [product])

  const images = useMemo<string[]>(
    () =>
      product?.assets?.map((a: { url: string }) => img(a.url)) ??
      (Array.isArray(product?.mainImage)
        ? product.mainImage.map(img)
        : product?.mainImage
        ? [img(product.mainImage)]
        : []),
    [product]
  )

  // Unique colors
  const availableColors = useMemo(() => {
    const seen = new Set<string>()
    const out: { id: string; name: string; hex: string }[] = []
    variants.forEach((v) => {
      if (!seen.has(v.colorId)) {
        seen.add(v.colorId)
        out.push({ id: v.colorId, name: v.colorName, hex: v.colorCode })
      }
    })
    return out
  }, [variants])

  // Sizes for selected color
  const availableSizes = useMemo(
    () =>
      selectedColorId
        ? variants
            .filter((v) => v.colorId === selectedColorId)
            .map((v) => ({ id: v.sizeId, name: v.size, stock: v.stock }))
        : [],
    [variants, selectedColorId]
  )

  // Auto-select first color
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColorId) {
      setSelectedColorId(availableColors[0].id)
    }
  }, [availableColors, selectedColorId])

  // ── Add to cart ────────────────────────────────────────────────────────────
  const handleAddToCart = async (): Promise<boolean> => {
    if (!token) { router.push('/login'); return false }
    if (!selectedColorId) { toast.error('Please select a color'); return false }
    if (!selectedSizeId) { toast.error('Please select a size'); return false }

    const toastId = toast.loading('Adding to bag…')
    try {
      await addToCart({
        productId: product._id,
        colorId: selectedColorId,
        sizeId: selectedSizeId,
        quantity: 1,
      }).unwrap()
      toast.success('Added to your bag!', { id: toastId })
      return true
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Failed to add to bag'
      toast.error(msg, { id: toastId })
      return false
    }
  }

  // ── Buy now ────────────────────────────────────────────────────────────────
  const handleBuyNow = async () => {
    if (!token) { router.push('/login'); return }
    if (!selectedColorId || !selectedSizeId) {
      toast.error('Please select color and size')
      return
    }
    setIsBuyingNow(true)
    const ok = await handleAddToCart()
    if (ok) router.push('/checkout')
    setIsBuyingNow(false)
  }

  const selectedColorName = availableColors.find((c) => c.id === selectedColorId)?.name ?? ''
  const hasDiscount =
    product?.pricing?.basePrice && product.pricing.basePrice !== product.pricing.salePrice

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-screen bg-[#191B1C] flex items-center justify-center">
        <Navbar />
        <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10">
          <Loader size={15} className="animate-spin text-[#F42D23]" />
          <span className="text-[11px] uppercase tracking-widest text-[#F4F4ED]/60" style={{ fontFamily: 'satoshi' }}>
            Loading product…
          </span>
        </div>
      </div>
    )
  }

  // ── Error / Not found ──────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="h-screen bg-[#191B1C] flex flex-col items-center justify-center gap-5">
        <Navbar />
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Package size={24} className="text-[#F4F4ED]/20" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#F4F4ED]/40" style={{ fontFamily: 'satoshi' }}>
          Product not found
        </p>
        <button
          onClick={() => router.push('/')}
          className="text-xs uppercase tracking-widest text-[#F42D23] hover:underline"
          style={{ fontFamily: 'satoshi' }}
        >
          Back to Home
        </button>
      </div>
    )
  }

  // ── Main layout ────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#191B1C]">
      <Navbar />

      {/*
        Fixed panel pinned to the viewport below the navbar.
        Both halves scroll independently — the page body never scrolls.
      */}
      {/*
        Mobile  → container scrolls as one column
        Desktop → container is rigid; each half scrolls independently
      */}
      <div className="fixed inset-0 top-[88px] bg-[#191B1C]
        flex flex-col overflow-y-auto
        lg:flex-row lg:overflow-hidden
      ">

        {/* ── LEFT: Image gallery ──────────────────────────────────────── */}
        <div className="w-full bg-[#111213] relative lg:w-1/2 lg:h-full lg:overflow-y-auto">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-5 left-5 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={16} className="text-[#F4F4ED]" />
          </button>

          {images.length === 0 ? (
            <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
              <Package size={48} className="text-[#F4F4ED]/10" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-[#191B1C]">
              {images.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`
                    relative overflow-hidden cursor-pointer aspect-[4/5]
                    transition-all duration-300
                    ${selectedImage === i ? 'ring-2 ring-inset ring-[#F42D23]' : ''}
                  `}
                >
                  <ZoomImage src={src} alt={`${product.name} — view ${i + 1}`} />
                  {selectedImage === i && (
                    <div className="absolute inset-0 bg-[#F42D23]/10 pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Details panel ─────────────────────────────────────── */}
        <div className="w-full bg-[#191B1C] lg:w-1/2 lg:h-full lg:overflow-y-auto">
          <div className="min-h-full flex items-start lg:items-center">
            <div className="w-full px-6 py-10 lg:px-14 lg:py-12 max-w-xl mx-auto space-y-6">

              {/* Category */}
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-[#F42D23]"
                style={{ fontFamily: 'satoshi' }}
              >
                {product.category?.[0] ?? 'Dripside'}
              </p>

              {/* Name + Price */}
              <div className="space-y-3">
                <h1
                  className="text-[#F4F4ED] text-2xl uppercase leading-tight tracking-tight"
                  style={{ fontFamily: 'futuraCB' }}
                >
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[#F4F4ED] text-xl"
                    style={{ fontFamily: 'futuraCB' }}
                  >
                    ₹ {product.pricing?.salePrice?.toLocaleString('en-IN')}.00
                  </span>
                  {hasDiscount && (
                    <>
                      <span
                        className="text-[#F4F4ED]/30 text-sm line-through"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        ₹ {product.pricing.basePrice.toLocaleString('en-IN')}
                      </span>
                      <span
                        className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#F42D23]/15 text-[#F42D23]"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        {Math.round((1 - product.pricing.salePrice / product.pricing.basePrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p
                  className="text-[#F4F4ED]/45 text-[11px] uppercase leading-relaxed"
                  style={{ fontFamily: 'satoshi' }}
                >
                  {product.description}
                </p>
              )}

              <div className="border-t border-white/[0.07]" />

              {/* Color selector */}
              {availableColors.length > 0 && (
                <div className="space-y-3">
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] text-[#F4F4ED]/40"
                    style={{ fontFamily: 'satoshi' }}
                  >
                    Colour —{' '}
                    <span className="text-[#F4F4ED]/80">{selectedColorName}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.id}
                        title={color.name}
                        onClick={() => {
                          setSelectedColorId(color.id)
                          setSelectedSizeId('')
                        }}
                        className={`
                          relative w-8 h-8 rounded-full border-2 transition-all duration-200
                          ${selectedColorId === color.id
                            ? 'border-[#F42D23] scale-110 shadow-md shadow-[#F42D23]/30'
                            : 'border-white/20 hover:border-white/50'
                          }
                        `}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColorId === color.id && (
                          <span className="absolute inset-0 rounded-full border-2 border-[#191B1C] scale-[0.6] pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div className="space-y-3">
                <p
                  className="text-[10px] uppercase tracking-[0.25em] text-[#F4F4ED]/40"
                  style={{ fontFamily: 'satoshi' }}
                >
                  Size
                </p>
                {availableSizes.length === 0 ? (
                  <p className="text-xs text-[#F4F4ED]/25 italic" style={{ fontFamily: 'satoshi' }}>
                    Select a colour to see available sizes
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                        disabled={size.stock <= 0}
                        className={`
                          min-w-[52px] px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-wider
                          border transition-all duration-200
                          ${selectedSizeId === size.id
                            ? 'bg-[#F4F4ED] text-[#191B1C] border-[#F4F4ED]'
                            : size.stock <= 0
                            ? 'bg-white/[0.03] text-[#F4F4ED]/20 border-white/10 cursor-not-allowed line-through'
                            : 'bg-white/[0.04] text-[#F4F4ED]/70 border-white/10 hover:border-white/30 hover:text-[#F4F4ED]'
                          }
                        `}
                        style={{ fontFamily: 'satoshi' }}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-12 rounded-xl
                    bg-[#F42D23] text-[#F4F4ED] text-[11px] uppercase tracking-[0.15em]
                    hover:bg-[#F4F4ED] hover:text-[#191B1C]
                    active:scale-[0.98] transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  style={{ fontFamily: 'futuraCB' }}
                >
                  {isAdding ? (
                    <><Loader size={14} className="animate-spin" /> Adding…</>
                  ) : (
                    <><ShoppingBag size={14} /> Add to Bag</>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isAdding || isBuyingNow}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-12 rounded-xl
                    bg-white/[0.06] border border-white/10 text-[#F4F4ED] text-[11px] uppercase tracking-[0.15em]
                    hover:bg-white/10 hover:border-white/20
                    active:scale-[0.98] transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  style={{ fontFamily: 'futuraCB' }}
                >
                  {isBuyingNow ? (
                    <><Loader size={14} className="animate-spin" /> Processing…</>
                  ) : (
                    <><Zap size={14} /> Buy Now</>
                  )}
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-5 pt-1">
                {[
                  { icon: <Truck size={12} />, label: 'Free Shipping' },
                  { icon: <ShieldCheck size={12} />, label: 'Secure Payment' },
                  { icon: <Package size={12} />, label: 'Easy Returns' },
                ].map(({ icon, label }, i, arr) => (
                  <div key={label} className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-[#F4F4ED]/25">
                      {icon}
                      <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: 'satoshi' }}>
                        {label}
                      </span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-3 bg-white/10" />}
                  </div>
                ))}
              </div>

              {/* Artist info */}
              {product.artistId && (
                <>
                  <div className="border-t border-white/[0.07]" />
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0">
                      {product.artistId.profileImage ? (
                        <img
                          src={img(product.artistId.profileImage)}
                          alt={product.artistId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-[#F4F4ED] text-xs"
                          style={{ fontFamily: 'futuraCB' }}
                        >
                          {(product.artistId.brandname ?? product.artistId.name)?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.2em] text-[#F4F4ED]/30"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        Artist
                      </p>
                      <p
                        className="text-sm uppercase tracking-tight text-[#F4F4ED] mt-0.5"
                        style={{ fontFamily: 'futuraCB' }}
                      >
                        {product.artistId.brandname ?? product.artistId.name}
                      </p>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
