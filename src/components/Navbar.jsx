import logo from "../assets/nvwlogo.svg"

const FlipLink = ({ text, light = false }) => {
  return (
    <button
      className={`
        group
        relative
        overflow-hidden
        h-[20px]
        flex items-center justify-center
        ${light ? "text-[#191B1C]" : "text-[#F4F4ED]"}
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
            will-change-transform
          "
        >
          {text.split("").map((letter, i) => (
            <span
              key={i}
              className="
                inline-block
                font-satoshi
                text-sm
              "
              style={{
                transitionDelay: `${i * 0.04}s`,
              }}
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
            will-change-transform
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
                will-change-transform
              "
              style={{
                transitionDelay: `${i * 0.04}s`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

      </span>
    </button>
  )
}
export default function Navbar() {
  return (
    <nav className="w-full fixed z-100 px-6 pt-4">
      <div
        className="
          relative
          flex items-center justify-between
          h-[72px]
          px-8
          rounded-full
          bg-[#F42D23]
        "
      >
        {/* LEFT MENU */}
        <button
          className="
            group
            flex flex-col
            justify-center
            gap-[6px]
          "
        >
          <span
            className="
              w-10 h-[4px]
              rounded-full
              bg-[#F4F4ED]
              transition-all
              duration-500
              ease-[cubic-bezier(0.76,0,0.24,1)]
              group-hover:w-7
            "
          />

          <span
            className="
              w-10 h-[4px]
              rounded-full
              bg-[#F4F4ED]
              transition-all
              duration-500
              ease-[cubic-bezier(0.76,0,0.24,1)]
              group-hover:w-12
            "
          />
        </button>

        {/* CENTER LOGO */}
        <div
          className="
            absolute
            left-1/2
            -translate-x-1/2
          "
        >
          <img
            src={logo}
            alt="logo"
            className="h-6 object-contain"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-8">

          <FlipLink text="Search" />

          <FlipLink text="Shop" />

          <button
            className="
              px-6
              py-3
              rounded-full
              bg-[#F4F4ED]
            "
          >
            <FlipLink
              text="Explore"
              light
            />
          </button>

        </div>
      </div>
    </nav>
  )
}