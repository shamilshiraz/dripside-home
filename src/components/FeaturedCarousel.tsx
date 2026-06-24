'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import FlipLink from '@/components/ui/FlipLink'

const products = [
  {
    image: '/ti1.webp',
    name: 'White Mammoth Hoodie',
    price: '3899/-',
  },
  {
    image: '/ti4.webp',
    name: 'Hebi no O hana',
    price: '4899/-',
  },
  {
    image: '/ti2.webp',
    name: "Jewel's White Tee",
    price: '1899/-',
  },
  {
    image: '/ti3.webp',
    name: 'Phoenix set',
    price: '7800/-',
  },
  {
    image: '/ti1.webp',
    name: 'Drop Tee',
    price: '1800/-',
  },
  {
    image: '/ti2.webp',
    name: 'Obsidian Cargo',
    price: '3499/-',
  },
  {
    image: '/ti3.webp',
    name: 'Ember Jacket',
    price: '5999/-',
  },
  {
    image: '/ti4.webp',
    name: 'Void Crewneck',
    price: '2999/-',
  },
  {
    image: '/ti1.webp',
    name: 'Ash Longline Tee',
    price: '1599/-',
  },
  {
    image: '/ti3.webp',
    name: 'Dusk Co-ord Set',
    price: '6800/-',
  },
]

export default function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const amount = 390

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="w-full bg-[#e8e6e1] py-8 sm:py-10 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 sm:px-8 mb-6">
        <h1
          className="
            uppercase
            text-[#111]
            text-[15vw]
            sm:text-[4vw]
            leading-none
          "
          style={{ fontFamily: 'futuraCB' }}
        >
          FEATURED
        </h1>

        {/* ARROWS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="
              w-12
              h-12
              rounded-full
              bg-[#ef4934]
              flex
              items-center
              justify-center
              text-white
              hover:scale-105
              transition-transform
            "
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={() => scroll('right')}
            className="
              w-12
              h-12
              rounded-full
              bg-[#ef4934]
              flex
              items-center
              justify-center
              text-white
              hover:scale-105
              transition-transform
            "
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}
      <div
        ref={scrollRef}
        className="
          flex
          gap-4
          overflow-x-auto
          px-4
          sm:px-8
          pb-2
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {products.map((product, i) => (
          <motion.div
            key={i}
            transition={{ duration: 0.3 }}
            className="
              shrink-0
              w-[86vw]
              sm:w-[390px]
              group
              cursor-pointer
            "
          >
            {/* IMAGE */}
            <div className="relative overflow-hidden bg-[#d9d9d9]">
              <img
                src={product.image}
                alt={product.name}
                className="
                  w-full
                  aspect-[0.8]
                  object-cover
                "
              />

              {/* OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/20
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  flex
                  items-center
                  justify-center
                "
              >
                <p
                  className="text-white text-sm uppercase tracking-wide"
                  style={{ fontFamily: 'satoshi' }}
                >
                  View Product
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="mt-3">
              <h3
                className="
                  text-[#111]
                  text-sm
                  sm:text-base
                  leading-tight
                "
                style={{ fontFamily: 'satoshi' }}
              >
                {product.name}
              </h3>

              <p
                className="
                  text-[#111]
                  text-sm
                  mt-1
                "
                style={{ fontFamily: 'satoshi' }}
              >
                {product.price}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="px-4 sm:px-8 mt-8">
        <div
          className="
            w-fit
            px-6
            py-3
            rounded-full
            bg-[#ef4934]
            text-white
          "
        >
          <FlipLink text="Shop all" />
        </div>
      </div>
    </section>
  )
}
