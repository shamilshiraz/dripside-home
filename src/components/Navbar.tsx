'use client'

import { useState } from 'react'
import FlipLink from '@/components/ui/FlipLink'

const menuLinks = [
  { label: 'Home', sub: 'Back to start' },
  { label: 'Shop', sub: 'Browse the collection' },
  { label: 'About', sub: 'Our story' },
  { label: 'Journal', sub: 'Notes & updates' },
  { label: 'Contact', sub: 'Get in touch' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* DROPDOWN */}
      <div
        className={`
          fixed inset-x-0 top-0 z-40
          px-2 sm:px-6
          transition-all duration-700
          ease-[cubic-bezier(0.76,0,0.24,1)]
          ${
            open
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }
        `}
      >
        <div
          className={`
            bg-[#191B1C]
            rounded-b-3xl
            pt-28
            pb-10
            px-6
            sm:px-10
            transition-transform duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
            origin-top
            ${open ? 'scale-y-100' : 'scale-y-0'}
          `}
        >
          {/* NAV LINKS */}
          <nav className="flex flex-col gap-1 mb-10">
            {menuLinks.map(({ label, sub }, i) => (
              <a
                key={label}
                href="#"
                className="
                  group
                  flex
                  items-baseline
                  justify-between
                  border-b
                  border-white/10
                  py-4
                  text-[#F4F4ED]
                  hover:text-[#F42D23]
                  transition-[opacity,transform,color]
                  duration-500
                "
                style={{
                  transitionDelay: open
                    ? `${0.08 + i * 0.06}s`
                    : '0s',
                  opacity: open ? 1 : 0,
                  transform: open
                    ? 'translateY(0px)'
                    : 'translateY(14px)',
                }}
              >
                <span
                  className="
                    font-satoshi
                    text-4xl
                    sm:text-5xl
                    font-medium
                    tracking-tight
                  "
                >
                  {label}
                </span>

                <span
                  className="
                    hidden
                    sm:block
                    font-satoshi
                    text-sm
                    text-white/40
                    group-hover:text-[#F42D23]/60
                    transition-colors
                    duration-300
                  "
                >
                  {sub}
                </span>
              </a>
            ))}
          </nav>

          {/* BOTTOM ROW */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-start
              sm:items-center
              justify-between
              gap-6
              transition-[opacity,transform]
              duration-500
            "
            style={{
              transitionDelay: open ? '0.42s' : '0s',
              opacity: open ? 1 : 0,
              transform: open
                ? 'translateY(0px)'
                : 'translateY(10px)',
            }}
          >
            {/* SOCIALS */}
            <div className="flex gap-6">
              {['Instagram', 'Twitter', 'TikTok'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="
                    font-satoshi
                    text-sm
                    text-white/40
                    hover:text-[#F4F4ED]
                    transition-colors
                    duration-300
                  "
                >
                  {s}
                </a>
              ))}
            </div>

            {/* CTA */}
            <button
              className="
                px-6
                py-3
                rounded-full
                bg-[#F42D23]
                text-[#F4F4ED]
                font-satoshi
                text-sm
                hover:bg-[#F4F4ED]
                hover:text-[#191B1C]
                transition-colors
                duration-300
              "
            >
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="w-full fixed z-50 px-2 sm:px-6 pt-4">
        <div
          className="
            relative
            flex
            items-center
            justify-between
            h-[72px]
            px-5
            sm:px-8
            rounded-full
            bg-[#F42D23]
          "
        >
          {/* HAMBURGER */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="
              flex
              flex-col
              justify-center
              gap-[6px]
            "
            aria-label="Toggle menu"
          >
            <span
              className={`
                block
                w-10
                h-[4px]
                rounded-full
                bg-[#F4F4ED]
                transition-all
                duration-500
                ease-[cubic-bezier(0.76,0,0.24,1)]
                ${
                  open
                    ? 'translate-y-[5px] rotate-45'
                    : 'hover:w-7'
                }
              `}
            />

            <span
              className={`
                block
                w-10
                h-[4px]
                rounded-full
                bg-[#F4F4ED]
                transition-all
                duration-500
                ease-[cubic-bezier(0.76,0,0.24,1)]
                ${
                  open
                    ? '-translate-y-[5px] -rotate-45'
                    : 'hover:w-12'
                }
              `}
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
              src="/icons/nvwlogo.svg"
              alt="logo"
              className="h-6 object-contain"
            />
          </div>

          {/* RIGHT - DESKTOP (hidden on mobile) */}
          <div
            className="
              hidden
              sm:flex
              items-center
              gap-8
            "
          >
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
              <FlipLink text="Explore" light />
            </button>
          </div>

          {/* MOBILE SPACER - HIDDEN ON DESKTOP, VISIBLE ON MOBILE */}
          <div
            className="sm:hidden w-10"
            aria-hidden="true"
          />
        </div>
      </nav>
    </>
  )
}
