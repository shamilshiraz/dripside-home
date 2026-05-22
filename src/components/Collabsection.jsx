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
            style={{ fontFamily: "futuraCB" }}
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
  );
}