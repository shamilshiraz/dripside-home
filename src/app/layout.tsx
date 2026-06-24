import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/providers/LenisProvider'

export const metadata: Metadata = {
  title: 'Dripside',
  description: 'A collective for artists who strive to build themselves',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
