'use client'

import { useState, type MouseEvent } from 'react'
import { User, LogOut, ExternalLink, ChevronRight, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { clearCredentials } from '@/redux/slices/authSlice'
import { useSignoutMutation } from '@/redux/api/UserApi'
import FlipLink from '@/components/ui/FlipLink'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const menuLinks = [
  { label: 'Home', href: '/', sub: 'Back to start' },
  { label: 'Shop', href: '/shop', sub: 'Browse the collection' },
  { label: 'About', href: '/about', sub: 'Our story' },
  { label: 'Journal', href: '/journal', sub: 'Notes & updates' },
  { label: 'Contact', href: '/contact', sub: 'Get in touch' },
]

const ARTIST_APP_URL =
  process.env.NEXT_PUBLIC_ARTIST_APP_URL ?? 'http://localhost:3001'

export default function Navbar() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { userInfo, token } = useSelector((state: RootState) => state.auth)
  const isLoggedIn = !!(userInfo && token)

  const [open, setOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const [signout] = useSignoutMutation()

  const handleSignout = async () => {
    try {
      await signout().unwrap()
    } catch {
      // ignore — clear client state regardless
    }
    dispatch(clearCredentials())
    toast.success('Signed out successfully.')
    setPopoverOpen(false)
    router.push('/')
  }

  const handleAccountClick = (event: MouseEvent) => {
    if (!isLoggedIn) {
      event.preventDefault()
      router.push('/login')
    }
  }

  const goToArtistApp = () => {
    setPopoverOpen(false)
    window.open(ARTIST_APP_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* DROPDOWN */}
      <div
        className={`
          fixed inset-x-0 top-0 z-40
          px-2 sm:px-6
          transition-all duration-700
          ease-[cubic-bezier(0.76,0,0.24,1)]
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div
          className={`
            bg-[#191B1C]
            rounded-b-3xl
            pt-28 pb-10 px-6 sm:px-10
            transition-transform duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]
            origin-top
            ${open ? 'scale-y-100' : 'scale-y-0'}
          `}
        >
          <nav className="flex flex-col gap-1 mb-10">
            {menuLinks.map(({ label, href, sub }, i) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="
                  group flex items-baseline justify-between
                  border-b border-white/10 py-4
                  text-[#F4F4ED] hover:text-[#F42D23]
                  transition-[opacity,transform,color] duration-500
                "
                style={{
                  transitionDelay: open ? `${0.08 + i * 0.06}s` : '0s',
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0px)' : 'translateY(14px)',
                }}
              >
                <span className="font-satoshi text-4xl sm:text-5xl font-medium tracking-tight">
                  {label}
                </span>
                <span className="hidden sm:block font-satoshi text-sm text-white/40 group-hover:text-[#F42D23]/60 transition-colors duration-300">
                  {sub}
                </span>
              </Link>
            ))}
          </nav>

          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-[opacity,transform] duration-500"
            style={{
              transitionDelay: open ? '0.42s' : '0s',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0px)' : 'translateY(10px)',
            }}
          >
            <div className="flex gap-6">
              {['Instagram', 'Twitter', 'TikTok'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-satoshi text-sm text-white/40 hover:text-[#F4F4ED] transition-colors duration-300"
                >
                  {s}
                </a>
              ))}
            </div>

            <button
              onClick={() => { setOpen(false); router.push('/') }}
              className="px-6 py-3 rounded-full bg-[#F42D23] text-[#F4F4ED] font-satoshi text-sm hover:bg-[#F4F4ED] hover:text-[#191B1C] transition-colors duration-300"
            >
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="w-full fixed z-50 px-2 sm:px-6 pt-4">
        <div className="relative flex items-center justify-between h-[72px] px-5 sm:px-8 rounded-full bg-[#F42D23]">
          {/* HAMBURGER */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col justify-center gap-[6px]"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-10 h-[4px] rounded-full bg-[#F4F4ED] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'translate-y-[5px] rotate-45' : 'hover:w-7'}`}
            />
            <span
              className={`block w-10 h-[4px] rounded-full bg-[#F4F4ED] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? '-translate-y-[5px] -rotate-45' : 'hover:w-12'}`}
            />
          </button>

          {/* CENTER LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/icons/nvwlogo.svg"
              alt="Dripside"
              className="h-6 object-contain"
            />
          </div>

          {/* RIGHT — DESKTOP */}
          <div className="hidden sm:flex items-center gap-8">
            <FlipLink text="Search" />
            <FlipLink text="Shop" />

            <div className="flex items-center gap-2">
              <button className="px-6 py-3 rounded-full bg-[#F4F4ED]">
                <FlipLink text="Explore" light />
              </button>

              {/* USER BUTTON */}
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                onClick={handleAccountClick}
                className="
                  w-10 h-10 rounded-full
                  cursor-pointer
                  bg-[#F4F4ED]/20 border border-[#F4F4ED]/30
                  flex items-center justify-center text-[#F4F4ED]
                  hover:bg-[#F4F4ED]/30 transition-colors duration-300
                  overflow-hidden
                "
                aria-label="Account"
              >
               
                  <User size={16} strokeWidth={1.8} />
              
              </PopoverTrigger>

              {isLoggedIn && (
                <PopoverContent
                  side="bottom"
                  align="end"
                  sideOffset={14}
                  className="w-80 p-0 border-0 bg-black rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="bg-[#191B1C] px-6 pt-6 pb-5">
                    {/* <p
                      className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
                      style={{ fontFamily: 'satoshi' }}
                    >
                      Signed in as
                    </p> */}
                    <h2
                      className="text-[#F4F4ED] text-2xl uppercase leading-none"
                      style={{ fontFamily: 'futuraCB' }}
                    >
                      {userInfo?.name ?? userInfo?.fullname ?? 'User'}
                    </h2>
                    {userInfo?.email && (
                      <p
                        className="text-[#F4F4ED]/40 text-xs mt-1 break-all"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        {userInfo.email}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#F4F4ED] px-6 py-5 flex flex-col gap-3">
                    <Link
                      href="/profile"
                      onClick={() => setPopoverOpen(false)}
                      className="
                        flex items-center justify-between
                        h-10 px-4 rounded-xl
                        bg-white border border-[#191B1C]/10
                        text-[#191B1C] text-sm
                        hover:border-[#191B1C]/30 transition-colors duration-200
                      "
                      style={{ fontFamily: 'satoshi' }}
                    >
                      My Profile
                      <ChevronRight size={14} className="text-[#191B1C]/40" />
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setPopoverOpen(false)}
                      className="
                        flex items-center justify-between
                        h-10 px-4 rounded-xl
                        bg-white border border-[#191B1C]/10
                        text-[#191B1C] text-sm
                        hover:border-[#191B1C]/30 transition-colors duration-200
                      "
                      style={{ fontFamily: 'satoshi' }}
                    >
                      Settings
                      <Settings size={14} className="text-[#191B1C]/40" />
                    </Link>

                    <button
                      onClick={goToArtistApp}
                      className="
                        flex items-center justify-between
                        h-10 px-4 rounded-xl
                        bg-white border border-[#191B1C]/10
                        text-[#191B1C] text-sm
                        hover:border-[#F42D23]/40 hover:text-[#F42D23] transition-colors duration-200
                      "
                      style={{ fontFamily: 'satoshi' }}
                    >
                      Switch to artist
                      <ExternalLink size={13} className="opacity-40" />
                    </button>

                    <button
                      onClick={handleSignout}
                      className="
                        mt-1 flex items-center justify-center gap-2
                        h-10 px-4 rounded-xl
                        bg-[#191B1C] text-[#F4F4ED] text-sm uppercase tracking-[0.08em]
                        hover:bg-[#F42D23] transition-colors duration-300
                      "
                      style={{ fontFamily: 'futuraCB' }}
                    >
                      <LogOut size={13} />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              )}
              </Popover>
            </div>
          </div>

          {/* MOBILE SPACER */}
          <div className="sm:hidden w-10" aria-hidden="true" />
        </div>
      </nav>
    </>
  )
}
