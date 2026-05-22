import { motion } from "framer-motion";

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

        {/* TOP TEXT */}
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

        {/* BOTTOM TEXT */}
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

export default function CreatorCTASection() {
  return (
    <section className="relative h-screen overflow-hidden">
      
      {/* BG IMAGE */}
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        viewport={{ once: true }}
        className="absolute inset-0"
      >
        <img
          src="/cdwasa.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/20" />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          h-full
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-4
        "
      >
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="
            text-white
            uppercase
            leading-none
            text-[16vw]
            sm:text-[7vw]
            max-w-[1200px]
          "
          style={{ fontFamily: "futuraCB" }}
        >
          ARE YOU A CREATOR?
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          viewport={{ once: true }}
          className="
            mt-4
            text-white
            text-[12px]
            sm:text-[15px]
            leading-[1.5]
            max-w-[760px]
          "
          style={{ fontFamily: "satoshi" }}
        >
          Join our creatives shaping culture, pushing boundaries, and
          redefining expression. Step into our collective where art meets
          street, ideas turn raw, and individuality is not just welcomed,
          it’s worn loud.
        </motion.p>

        {/* BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          viewport={{ once: true }}
          className="
            mt-8
            px-7
            py-3
            rounded-full
            bg-[#ef4934]
            text-white
          "
        >
          <FlipLink text="Join now" />
        </motion.div>
      </div>
    </section>
  );
}