'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
  ArrowLeft,
  ArrowRight,
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
import ZoomImage from '@/components/ZoomImage'

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
      <>
        <Navbar compact flat />
        <div className="flex min-h-screen items-center justify-center bg-[#e8e6e1]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#191B1C]/5 border border-[#191B1C]/10">
            <Loader size={15} className="animate-spin text-[#F42D23]" />
            <span className="text-[11px] uppercase tracking-widest text-[#191B1C]/60" style={{ fontFamily: 'satoshi' }}>
              Loading product…
            </span>
          </div>
        </div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Navbar compact flat />
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#e8e6e1]">
          <div className="w-14 h-14 rounded-2xl bg-[#191B1C]/5 border border-[#191B1C]/10 flex items-center justify-center">
            <Package size={24} className="text-[#191B1C]/25" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#191B1C]/50" style={{ fontFamily: 'satoshi' }}>
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
      </>
    )
  }

  // ── Main layout ────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar compact flat />

      <div className="flex flex-col bg-[#e8e6e1] lg:h-[calc(100vh-4rem)] lg:flex-row lg:overflow-hidden mt-16">

        {/* ══ IMAGE AREA: Left sticky + Middle scrollable gallery ══ */}
        <div className="flex w-full lg:w-[62%] lg:h-full">

          {/* ── Left: sticky main image ── */}
          <div className="hidden lg:block lg:w-[54%] lg:h-full sticky top-0 shrink-0 bg-[#dfddd6] relative overflow-hidden">
            {images.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={48} className="text-[#191B1C]/15" />
              </div>
            ) : (
              <ZoomImage
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.name}
                zoomScale={2.2}
              />
            )}
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-5 z-10 p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-colors"
            >
              <ArrowLeft size={16} className="text-[#F4F4ED]" />
            </button>
            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[#F4F4ED]/70 text-[10px]" style={{ fontFamily: 'satoshi' }}>
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>

          {/* ── Middle: scrollable image gallery ── */}
          <div
            data-lenis-prevent
            className="hidden lg:flex lg:flex-col lg:w-[46%] lg:h-full lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-[#dfddd6]">
                <Package size={32} className="text-[#191B1C]/15" />
              </div>
            ) : (
              images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative block w-full shrink-0 aspect-[4/5] overflow-hidden transition-all duration-200 ${
                    selectedImage === i ? 'ring-2 ring-inset ring-[#F42D23]' : ''
                  }`}
                >
                  <ZoomImage src={src} alt={`View ${i + 1}`} zoomScale={1.8} />
                  {selectedImage === i && (
                    <div className="absolute inset-0 bg-[#F42D23]/5 pointer-events-none" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* ── Mobile: single image with prev/next ── */}
          <div className="lg:hidden w-full relative bg-[#dfddd6] aspect-[4/5]">
            {images.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={48} className="text-[#191B1C]/15" />
              </div>
            ) : (
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            )}
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-5 z-10 p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-colors"
            >
              <ArrowLeft size={16} className="text-[#F4F4ED]" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ArrowLeft size={15} className="text-[#F4F4ED]" />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ArrowRight size={15} className="text-[#F4F4ED]" />
                </button>
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[#F4F4ED]/70 text-[10px]" style={{ fontFamily: 'satoshi' }}>
                  {selectedImage + 1} / {images.length}
                </div>
                {/* Mobile thumbnail strip */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${selectedImage === i ? 'bg-white scale-125' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: details panel ── */}
        <div data-lenis-prevent className="lg:w-[38%] w-full lg:h-full lg:overflow-y-auto bg-[#e8e6e1]">
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
                  className="text-[#111] text-2xl uppercase leading-tight tracking-tight"
                  style={{ fontFamily: 'futuraCB' }}
                >
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[#111] text-xl"
                    style={{ fontFamily: 'futuraCB' }}
                  >
                    ₹ {product.pricing?.salePrice?.toLocaleString('en-IN')}.00
                  </span>
                  {hasDiscount && (
                    <>
                      <span
                        className="text-[#111]/35 text-sm line-through"
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
                  className="text-[#111]/55 text-[11px] uppercase leading-relaxed"
                  style={{ fontFamily: 'satoshi' }}
                >
                  {product.description}
                </p>
              )}

              <div className="border-t border-[#111]/10" />

              {/* Color selector */}
              {availableColors.length > 0 && (
                <div className="space-y-3">
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] text-[#111]/45"
                    style={{ fontFamily: 'satoshi' }}
                  >
                    Colour —{' '}
                    <span className="text-[#111]/80">{selectedColorName}</span>
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
                            : 'border-[#111]/20 hover:border-[#111]/45'
                          }
                        `}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColorId === color.id && (
                          <span className="absolute inset-0 rounded-full border-2 border-[#e8e6e1] scale-[0.6] pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div className="space-y-3">
                <p
                  className="text-[10px] uppercase tracking-[0.25em] text-[#111]/45"
                  style={{ fontFamily: 'satoshi' }}
                >
                  Size
                </p>
                {availableSizes.length === 0 ? (
                  <p className="text-xs text-[#111]/35 italic" style={{ fontFamily: 'satoshi' }}>
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
                            ? 'bg-[#111] text-[#F4F4ED] border-[#111]'
                            : size.stock <= 0
                            ? 'bg-[#111]/5 text-[#111]/25 border-[#111]/10 cursor-not-allowed line-through'
                            : 'bg-[#111]/5 text-[#111]/70 border-[#111]/10 hover:border-[#111]/30 hover:text-[#111]'
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
                    hover:bg-[#111] hover:text-[#F4F4ED]
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
                    bg-[#111]/5 border border-[#111]/10 text-[#111] text-[11px] uppercase tracking-[0.15em]
                    hover:bg-[#111] hover:text-[#F4F4ED] hover:border-[#111]
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
                    <div className="flex items-center gap-1.5 text-[#111]/35">
                      {icon}
                      <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: 'satoshi' }}>
                        {label}
                      </span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-3 bg-[#111]/10" />}
                  </div>
                ))}
              </div>

              {/* Artist info */}
              {product.artistId && (
                <>
                  <div className="border-t border-[#111]/10" />
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111]/5 border border-[#111]/10">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111]/10 shrink-0">
                      {product.artistId.profileImage ? (
                        <img
                          src={img(product.artistId.profileImage)}
                          alt={product.artistId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-[#111] text-xs"
                          style={{ fontFamily: 'futuraCB' }}
                        >
                          {(product.artistId.brandname ?? product.artistId.name)?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.2em] text-[#111]/40"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        Artist
                      </p>
                      <p
                        className="text-sm uppercase tracking-tight text-[#111] mt-0.5"
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
    </>
  )
}
