export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* BG */}
      <img
        src="/hero2.jpg"
        alt="hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/10" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-end px-6 pb-10">
        <div className="max-w-7xl">

          {/* HEADING */}
          <h2
            style={{ fontFamily: "FuturaEB" }}
            className="
              uppercase
              text-[#F4F4ED]
              leading-[0.92]
              tracking-[-0.04em]
              text-[2.5rem]
              md:text-[5rem]
              lg:text-[6.5rem]
            "
          >
            <span className="hero-line block">
              CREATE FROM WITHIN
            </span>

            <span
              className="hero-line block"
              style={{ animationDelay: "0.12s" }}
            >
              UNLEASH YOURSELF
            </span>
          </h2>

          {/* SUBTEXT */}
          <p
            className="
              hero-subtext
              mt-6
              max-w-2xl
              font-bold
              font-satoshi
              uppercase
              text-[#F4F4ED]
            "
          >
            A COLLECTIVE FOR ARTIST WHO STRIVE BUILD THEMSELVES,
            OVERCOMING THE CHALLENGES AND THE CHAOS
          </p>

        </div>
      </div>
    </section>
  )
}