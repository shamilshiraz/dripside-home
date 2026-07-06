'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useGetAllProductsPublicQuery } from '@/redux/api/UserApi'

interface Product {
  _id: string
  name: string
  assets?: { url: string }[]
  mainImage?: string | string[]
  pricing?: { salePrice: number }
  artistId?: {
    brandname?: string
    userId?: { name?: string }
  }
}

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? ''
function img(src?: string) {
  if (!src) return '/placeholder.png'
  return src.startsWith('http') ? src : `${IMAGE_BASE}/${src.replace(/^\//, '')}`
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset + autofocus whenever the dialog opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setDebouncedQuery('')
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    }
  }, [open])

  // Debounce query -> live search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const { data, isFetching } = useGetAllProductsPublicQuery(
    { limit: 8, search: debouncedQuery || undefined },
    { skip: !open }
  )

  const products: Product[] = data?.data?.products ?? []
  const total: number = data?.data?.pagination?.total ?? products.length

  const goToProduct = (id: string) => {
    onOpenChange(false)
    router.push(`/products/${id}`)
  }

  const goToAllResults = () => {
    onOpenChange(false)
    router.push(`/products${query ? `?search=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogContent
          showCloseButton={false}
          className="
            top-[12%] left-1/2 -translate-x-1/2 translate-y-0
            w-[calc(100%-2rem)] max-w-2xl sm:max-w-2xl
            p-0 gap-0 rounded-2xl
            bg-[#141516] text-[#F4F4ED]
            ring-1 ring-white/10
          "
        >
          <DialogTitle className="sr-only">Search products</DialogTitle>

          {/* Input row */}
          <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
            <Search size={18} className="text-[#F4F4ED]/40 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query) goToAllResults()
              }}
              placeholder="Search for products, artists, drops…"
              className="flex-1 h-full bg-transparent outline-none text-sm placeholder:text-[#F4F4ED]/30"
              style={{ fontFamily: 'satoshi' }}
            />
            {isFetching && <Loader2 size={15} className="animate-spin text-[#F4F4ED]/30 shrink-0" />}
            <button
              onClick={() => onOpenChange(false)}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#F4F4ED]/40 hover:text-[#F4F4ED] hover:bg-white/10 transition-colors"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            <p
              className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/35"
              style={{ fontFamily: 'satoshi' }}
            >
              {query ? (isFetching ? 'Searching…' : `${total} results`) : 'Popular right now'}
            </p>

            {!isFetching && products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Search size={18} className="text-[#F4F4ED]/25" />
                </div>
                <p className="text-sm text-[#F4F4ED]/50" style={{ fontFamily: 'satoshi' }}>
                  No products found for &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              <ul className="px-2 pb-2">
                {products.map((product) => {
                  const mainImage = Array.isArray(product.mainImage) ? product.mainImage[0] : product.mainImage
                  const image = img(product.assets?.[0]?.url ?? mainImage)
                  const artistName = product.artistId?.brandname ?? product.artistId?.userId?.name
                  const price = product.pricing?.salePrice

                  return (
                    <li key={product._id}>
                      <button
                        onClick={() => goToProduct(product._id)}
                        className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-12 h-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
                          <img src={image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate" style={{ fontFamily: 'satoshi' }}>{product.name}</p>
                          {artistName && (
                            <p className="text-[11px] text-[#F4F4ED]/40 truncate" style={{ fontFamily: 'satoshi' }}>
                              {artistName}
                            </p>
                          )}
                        </div>
                        {price != null && (
                          <span className="shrink-0 text-sm font-semibold text-[#F4F4ED]/80" style={{ fontFamily: 'satoshi' }}>
                            ₹ {price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {query && products.length > 0 && (
            <button
              onClick={goToAllResults}
              className="flex items-center justify-between px-5 h-12 border-t border-white/10 text-xs uppercase tracking-widest text-[#F42D23] hover:bg-white/5 transition-colors cursor-pointer"
              style={{ fontFamily: 'futuraCB' }}
            >
              View all {total} results
              <ArrowRight size={14} />
            </button>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
