'use client'

import { motion } from 'framer-motion'
import FlipLink from '@/components/ui/FlipLink'

export default function TylerCollabSection() {
  return (
    <section className="relative h-screen overflow-hidden">

      {/* BG */}
      <div className="absolute inset-0">
        <img
          src="/rbg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          h-full
          flex
          items-center
          justify-center
          px-4
        "
      >
        <div className="flex flex-col items-center justify-center text-center mt-20">

          {/* TITLE */}
          <h1
            className="
              text-[#F4F4ED]
              uppercase
              leading-[0.9]
              text-[15vw]
              sm:text-[7vw]
              text-center
            "
            style={{ fontFamily: 'futuraCB' }}
          >
            DRIPSIDE X TYLER THE CREATOR
          </h1>

          {/* BUTTON */}
          <div
            className="
              mt-8
              px-8
              py-3
              rounded-full
              bg-[#F42D23]
              text-[#F4F4ED]
            "
          >
            <FlipLink text="Shop Now" />
          </div>

        </div>
      </div>
    </section>
  )
}
