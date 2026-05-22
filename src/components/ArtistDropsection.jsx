import { motion } from "framer-motion";

const products = ["ti2.webp", "ti3.webp", "ti4.webp"];

const FlipLink = ({ text, className = "" }) => {
  return (
    <button
      className={`
        group
        relative
        overflow-hidden
        h-[20px]
        flex items-center justify-center
        ${className}
      `}
    >
      <span className="relative block leading-none">
        {/* TOP */}
        <span
          className="
            flex
            group-hover:-translate-y-[140%]
            transition-transform
            duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
          "
        >
          {text.split("").map((letter, i) => (
            <span
              key={i}
              className="inline-block font-satoshi text-sm"
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

        {/* BOTTOM */}
        <span
          className="
            absolute
            left-0
            top-0
            flex
            translate-y-[140%]
            group-hover:translate-y-0
            transition-transform
            duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
          "
        >
          {text.split("").map((letter, i) => (
            <span
              key={i}
              className="
                inline-block
                font-satoshi
                text-sm
                opacity-0
                group-hover:opacity-100
                [transform:rotateX(-90deg)]
                group-hover:[transform:rotateX(0deg)]
                transition-all
                duration-700
                ease-[cubic-bezier(0.76,0,0.24,1)]
                [transform-origin:bottom]
              "
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
};

export default function ArtistDropSection() {
  return (
    <section className="w-full bg-[#0e1213] text-[#f3f1eb] px-4 sm:px-6 py-6">
      {/* TITLE */}
      <h1
        className="
          uppercase
          leading-[0.88]
          text-[18vw]
          sm:text-[5.5vw]
          mb-3
        "
        style={{ fontFamily: "futuraCB" }}
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
              style={{ fontFamily: "futuraCB" }}
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
              style={{ fontFamily: "satoshi" }}
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
                Each piece, whether it’s a hoodie or a tee, carries an
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
                style={{ fontFamily: "satoshi" }}
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
  );
}