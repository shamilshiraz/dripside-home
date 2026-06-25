'use client'

import { motion } from 'framer-motion'
import FlipLink from '@/components/ui/FlipLink'

const products = ['ti2.webp', 'ti3.webp', 'ti4.webp']

export default function ArtistDropSection() {
  return (
    <section className="w-full bg-[#0e1213] text-[#f3f1eb] px-4 sm:px-6 py-20">
      {/* TITLE */}
      <h1
        className="
          uppercase
          leading-[0.88]
          text-[18vw]
          sm:text-[5.5vw]
          mb-3
        "
        style={{ fontFamily: 'futuraCB' }}
      >
        NEW DROP!
      </h1>

      {/* LAYOUT */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-[0.45fr_0.55fr]
          gap-3
          items-stretch
        "
      >
        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="overflow-hidden h-full"
        >
          <img
            src="/ti1.webp"
            alt=""
            className="
              w-full
              h-full
              object-cover
            "
          />
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="
            h-full
            flex
            flex-col
            justify-between
            self-stretch
          "
        >
          {/* TOP */}
          <div>
            <h2
              className="
                uppercase
                leading-[0.92]
                tracking-[-0.03em]
                text-[11vw]
                sm:text-[3vw]
                mb-2
              "
              style={{ fontFamily: 'futuraCB' }}
            >
              LEFT HANDER
            </h2>

            <div
              className="
                space-y-8
                text-[11px]
                sm:text-[16px]
                leading-[1.32]
                text-[#e8e4dc]
                max-w-[620px]
              "
              style={{ fontFamily: 'satoshi' }}
            >
              <p>
                LEFT Worldwide is a street-culture-driven label that
                blurs the line between wearable fashion and raw
                artistic expression. Founded in 2022 by Rabab MK, the
                brand draws heavy inspiration from graffiti,
                underground art scenes, and the unapologetic energy of
                urban life.
              </p>

              <p>
                Each piece, whether it&#39;s a hoodie or a tee, carries an
                intentional rawness unfinished edges, chaotic layouts,
                and bold visual language that speaks directly to a
                generation raised on individuality and noise.
              </p>

              <p>
                The recent LAKA collaboration with Kareemgraphy pushes
                this identity even further. It merges expressive
                calligraphy with abstract street motifs, creating
                pieces that feel both chaotic and calculated.
              </p>
            </div>
          </div>

          {/* BOTTOM */}
          <div>
            {/* BUTTON */}
            <div
              className="
                mt-4
                w-fit
                px-5
                py-2.5
                rounded-full
                bg-[#ef4934]
                text-white
              "
            >
              <FlipLink text="Explore artist" />
            </div>

            {/* ALSO EXPLORE */}
            <div className="mt-5">
              <p
                className="
                  text-[12px]
                  mb-2
                  text-[#f3f1eb]
                "
                style={{ fontFamily: 'satoshi' }}
              >
                Also explore:
              </p>

              <div className="flex gap-2.5">
                {products.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <img
                      src={img}
                      alt=""
                      className="
                        w-[82px]
                        sm:w-[150px]
                        aspect-[0.78]
                        object-cover
                      "
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
