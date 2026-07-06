'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CreatorCta from '@/components/CreatorCta'
import FlipLink from '@/components/ui/FlipLink'

const VALUES = [
  {
    n: '01',
    t: 'Community',
    d: 'Dripside exists because independent artists needed a place to be seen, not buried under algorithms.',
  },
  {
    n: '02',
    t: 'Craft',
    d: 'Every drop is made in small batches with real fabric, real print quality, and zero shortcuts.',
  },
  {
    n: '03',
    t: 'Culture',
    d: 'We back the people shaping street culture from the ground up, not the trends chasing them.',
  },
]

const STATS = [
  { n: '120+', l: 'Independent Artists' },
  { n: '5K+', l: 'Pieces Shipped' },
  { n: '30+', l: 'Cities Reached' },
  { n: '2022', l: 'Founded' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero2.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#191B1C] via-black/40 to-black/20" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p
            className="text-[#F42D23] text-[10px] uppercase tracking-[0.4em] mb-4"
            style={{ fontFamily: 'satoshi' }}
          >
            Our Story
          </p>
          <h1
            className="text-[#F4F4ED] uppercase leading-[0.88] text-[16vw] sm:text-[7.5vw]"
            style={{ fontFamily: 'futuraCB' }}
          >
            About
            <br />
            Dripside
          </h1>
          <p
            className="text-[#F4F4ED]/60 text-sm sm:text-base max-w-lg mt-6 leading-relaxed"
            style={{ fontFamily: 'satoshi' }}
          >
            A collaborative effort between the brand and artists, committed to
            supporting creative growth and fostering a vibrant community.
          </p>
        </div>
      </section>

      <div className="bg-[#F4F4ED]">
        {/* ── STORY SPLIT ───────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden order-2 lg:order-1"
          >
            <img
              src="/trevcre.webp"
              alt=""
              className="w-full aspect-[0.9] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <p
              className="text-[#F42D23] text-[10px] uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: 'satoshi' }}
            >
              How it started
            </p>
            <h2
              className="text-[#191B1C] uppercase text-[10vw] sm:text-[3.2vw] leading-[0.95] mb-6"
              style={{ fontFamily: 'futuraCB' }}
            >
              Built by artists,
              <br />
              for artists
            </h2>
            <div
              className="space-y-5 text-sm sm:text-base leading-relaxed text-[#191B1C]/60 max-w-lg"
              style={{ fontFamily: 'satoshi' }}
            >
              <p>
                Dripside started as a frustration — talented artists making
                incredible streetwear with nowhere real to sell it, stuck
                between marketplaces that didn&apos;t care and print shops
                that didn&apos;t understand the culture.
              </p>
              <p>
                So we built the platform we wished existed: one where
                independent creators keep their identity, set their own
                drops, and reach people who actually want what they&apos;re
                making — no gatekeeping, no algorithm roulette.
              </p>
            </div>

            <Link
              href="/artists"
              className="inline-block mt-8 px-7 py-3 rounded-full bg-[#191B1C] text-[#F4F4ED]"
            >
              <FlipLink text="Meet the artists" />
            </Link>
          </motion.div>
        </section>

        {/* ── VALUES ────────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#191B1C]/[0.07]">
          {VALUES.map((item) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#F42D23] text-xs" style={{ fontFamily: 'futuraCB' }}>
                {item.n}
              </span>
              <h3 className="text-[#191B1C] uppercase text-lg mt-2 mb-2" style={{ fontFamily: 'futuraCB' }}>
                {item.t}
              </h3>
              <p className="text-[#191B1C]/50 text-sm leading-relaxed" style={{ fontFamily: 'satoshi' }}>
                {item.d}
              </p>
            </motion.div>
          ))}
        </section>

        {/* ── STATS BAND ────────────────────────────────────────────────────── */}
        <section className="bg-[#191B1C] py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <motion.div
                key={stat.l}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p
                  className="text-[#F4F4ED] text-[10vw] sm:text-[3vw] leading-none"
                  style={{ fontFamily: 'futuraCB' }}
                >
                  {stat.n}
                </p>
                <p
                  className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#F4F4ED]/40"
                  style={{ fontFamily: 'satoshi' }}
                >
                  {stat.l}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COMMUNITY BANNER ──────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-[#F42D23] text-[10px] uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: 'satoshi' }}
            >
              The collective
            </p>
            <h2
              className="text-[#191B1C] uppercase text-[10vw] sm:text-[3.2vw] leading-[0.95] mb-6"
              style={{ fontFamily: 'futuraCB' }}
            >
              A home for
              <br />
              independent labels
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed text-[#191B1C]/60 max-w-lg"
              style={{ fontFamily: 'satoshi' }}
            >
              Every artist on Dripside runs their own store, sets their own
              prices, and owns their own brand. We handle the platform,
              payments, and reach — they handle what they do best: making
              things worth wearing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden"
          >
            <img
              src="/65A5C7E6-D144-4F7A-B6CB-0821B7F2076E.webp"
              alt=""
              className="w-full aspect-[0.78] object-cover"
            />
          </motion.div>
        </section>
      </div>

      <CreatorCta />
      <Footer />
    </>
  )
}
