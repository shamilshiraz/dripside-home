'use client'

import { useState } from 'react'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import FlipLink from '@/components/ui/FlipLink'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
          <div className="hidden sm:flex items-center gap-8">
            <FlipLink text="Search" />
            <FlipLink text="Shop" />

            <button className="px-6 py-3 rounded-full bg-[#F4F4ED]">
              <FlipLink text="Explore" light />
            </button>

            {/* USER BUTTON + LOGIN POPOVER */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="
                    w-10 h-10 rounded-full
                    bg-[#F4F4ED]/20
                    border border-[#F4F4ED]/30
                    flex items-center justify-center
                    text-[#F4F4ED]
                    hover:bg-[#F4F4ED]/30
                    transition-colors duration-300
                  "
                  aria-label="Account"
                >
                  <User size={16} strokeWidth={1.8} />
                </button>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={14}
                className="
                  w-80 p-0 border-0
                  rounded-2xl overflow-hidden
                  shadow-2xl
                "
              >
                {/* POPOVER HEADER */}
                <div className="bg-[#191B1C] px-6 pt-6 pb-5">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
                    style={{ fontFamily: 'satoshi' }}
                  >
                    Welcome back
                  </p>
                  <h2
                    className="text-[#F4F4ED] text-2xl uppercase leading-none"
                    style={{ fontFamily: 'futuraCB' }}
                  >
                    Sign In
                  </h2>
                </div>

                {/* POPOVER BODY */}
                <div className="bg-[#F4F4ED] px-6 py-5 flex flex-col gap-4">

                  {/* EMAIL */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="email"
                      className="text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/50"
                      style={{ fontFamily: 'satoshi' }}
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#191B1C]/30 pointer-events-none"
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="
                          pl-8 h-10 rounded-xl
                          bg-white border-[#191B1C]/10
                          text-[#191B1C] text-sm
                          placeholder:text-[#191B1C]/25
                          focus-visible:border-[#F42D23]
                          focus-visible:ring-[#F42D23]/20
                        "
                        style={{ fontFamily: 'satoshi' }}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/50"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        Password
                      </Label>
                      <button
                        className="text-[10px] text-[#F42D23] hover:underline"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#191B1C]/30 pointer-events-none"
                      />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="
                          pl-8 h-10 rounded-xl
                          bg-white border-[#191B1C]/10
                          text-[#191B1C] text-sm
                          placeholder:text-[#191B1C]/25
                          focus-visible:border-[#F42D23]
                          focus-visible:ring-[#F42D23]/20
                        "
                        style={{ fontFamily: 'satoshi' }}
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    className="
                      mt-1 w-full h-10 rounded-xl
                      bg-[#F42D23] text-[#F4F4ED]
                      text-sm uppercase tracking-[0.1em]
                      flex items-center justify-center gap-2
                      hover:bg-[#191B1C]
                      transition-colors duration-300
                      group
                    "
                    style={{ fontFamily: 'futuraCB' }}
                  >
                    Sign In
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                    />
                  </button>

                  {/* DIVIDER */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#191B1C]/10" />
                    <span
                      className="text-[10px] text-[#191B1C]/30 uppercase tracking-widest"
                      style={{ fontFamily: 'satoshi' }}
                    >
                      or
                    </span>
                    <div className="flex-1 h-px bg-[#191B1C]/10" />
                  </div>

                  {/* SIGN UP */}
                  <p
                    className="text-center text-xs text-[#191B1C]/50"
                    style={{ fontFamily: 'satoshi' }}
                  >
                    New here?{' '}
                    <button className="text-[#F42D23] font-medium hover:underline">
                      Create an account
                    </button>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
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
