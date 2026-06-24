'use client'

import { useState } from 'react'
import { User, Mail, Lock, ArrowRight, LogOut, ExternalLink, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { clearCredentials } from '@/redux/slices/authSlice'
import { useSigninMutation, useSignoutMutation } from '@/redux/api/UserApi'
import { setCredentials } from '@/redux/slices/authSlice'
import { setUserCookie } from '@/utils/setUserCookie'
import FlipLink from '@/components/ui/FlipLink'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const [signin, { isLoading }] = useSigninMutation()
  const [signout] = useSignoutMutation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setFormError('Please fill in all fields.')
      return
    }
    setFormError('')
    try {
      const response = await signin({ email, password }).unwrap()
      const token = response.data?.token
      if (!token) {
        setFormError('Login failed. Please try again.')
        return
      }
      dispatch(setCredentials({ userInfo: response.data.user, token }))
      setUserCookie({ userInfo: response.data.user, token })
      toast.success(`Welcome back, ${response.data.user?.name ?? ''}!`)
      setPopoverOpen(false)
      setEmail('')
      setPassword('')
    } catch {
      setFormError('Incorrect email or password.')
    }
  }

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

  const goToArtistApp = () => {
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

            <button className="px-6 py-3 rounded-full bg-[#F4F4ED]">
              <FlipLink text="Explore" light />
            </button>

            {/* USER BUTTON */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                className="
                  w-10 h-10 rounded-full
                  bg-[#F4F4ED]/20 border border-[#F4F4ED]/30
                  flex items-center justify-center text-[#F4F4ED]
                  hover:bg-[#F4F4ED]/30 transition-colors duration-300
                  overflow-hidden
                "
                aria-label="Account"
              >
                {isLoggedIn && userInfo?.name ? (
                  <span className="text-xs font-cb uppercase">
                    {userInfo.name.charAt(0)}
                  </span>
                ) : (
                  <User size={16} strokeWidth={1.8} />
                )}
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={14}
                className="w-80 p-0 border-0 rounded-2xl overflow-hidden shadow-2xl"
              >
                {isLoggedIn ? (
                  /* ── LOGGED IN STATE ── */
                  <>
                    {/* Header */}
                    <div className="bg-[#191B1C] px-6 pt-6 pb-5">
                      <p
                        className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        Signed in as
                      </p>
                      <h2
                        className="text-[#F4F4ED] text-2xl uppercase leading-none"
                        style={{ fontFamily: 'futuraCB' }}
                      >
                        {userInfo?.name ?? 'User'}
                      </h2>
                      <p
                        className="text-[#F4F4ED]/40 text-xs mt-1"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        {userInfo?.email}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="bg-[#F4F4ED] px-6 py-5 flex flex-col gap-3">
                      {/* Profile link */}
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

                      {/* Artist page redirect */}
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
                        Artist Dashboard
                        <ExternalLink size={13} className="opacity-40" />
                      </button>

                      {/* Sign out */}
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
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  /* ── LOGGED OUT STATE ── */
                  <>
                    {/* Header */}
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

                    {/* Form */}
                    <form
                      onSubmit={handleLogin}
                      className="bg-[#F4F4ED] px-6 py-5 flex flex-col gap-4"
                    >
                      {formError && (
                        <p
                          className="text-red-500 text-xs text-center"
                          style={{ fontFamily: 'satoshi' }}
                        >
                          {formError}
                        </p>
                      )}

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="nav-email"
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
                            id="nav-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-8 h-10 rounded-xl bg-white border-[#191B1C]/10 text-[#191B1C] text-sm placeholder:text-[#191B1C]/25 focus-visible:border-[#F42D23] focus-visible:ring-[#F42D23]/20"
                            style={{ fontFamily: 'satoshi' }}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="nav-password"
                            className="text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/50"
                            style={{ fontFamily: 'satoshi' }}
                          >
                            Password
                          </Label>
                          <button
                            type="button"
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
                            id="nav-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-8 h-10 rounded-xl bg-white border-[#191B1C]/10 text-[#191B1C] text-sm placeholder:text-[#191B1C]/25 focus-visible:border-[#F42D23] focus-visible:ring-[#F42D23]/20"
                            style={{ fontFamily: 'satoshi' }}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="
                          mt-1 w-full h-10 rounded-xl
                          bg-[#F42D23] text-[#F4F4ED]
                          text-sm uppercase tracking-[0.1em]
                          flex items-center justify-center gap-2
                          hover:bg-[#191B1C] transition-colors duration-300
                          disabled:opacity-60 disabled:cursor-not-allowed
                          group
                        "
                        style={{ fontFamily: 'futuraCB' }}
                      >
                        {isLoading ? (
                          <span className="w-4 h-4 border-2 border-t-transparent border-[#F4F4ED] rounded-full animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-0.5 transition-transform duration-300"
                            />
                          </>
                        )}
                      </button>

                      {/* Divider */}
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

                      {/* Sign up + Full page */}
                      <p
                        className="text-center text-xs text-[#191B1C]/50"
                        style={{ fontFamily: 'satoshi' }}
                      >
                        New here?{' '}
                        <Link
                          href="/signup"
                          onClick={() => setPopoverOpen(false)}
                          className="text-[#F42D23] font-medium hover:underline"
                        >
                          Create an account
                        </Link>
                      </p>

                      <Link
                        href="/login"
                        onClick={() => setPopoverOpen(false)}
                        className="
                          text-center text-[10px] text-[#191B1C]/30
                          hover:text-[#F42D23] transition-colors duration-200
                        "
                        style={{ fontFamily: 'satoshi' }}
                      >
                        Sign in on full page →
                      </Link>
                    </form>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* MOBILE SPACER */}
          <div className="sm:hidden w-10" aria-hidden="true" />
        </div>
      </nav>
    </>
  )
}
