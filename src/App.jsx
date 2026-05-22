import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DripsideIntro from './components/Stack'
import TylerCollabSection from './components/Collabsection'
import ArtistDropSection from './components/ArtistDropsection'
import FeaturedCarousel from './components/Featured'
import CreatorCTASection from './components/CreatorCta'
import Footer from './components/Footer'

import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div>
      <Navbar/>
      <Hero/>
      <DripsideIntro/>
      <TylerCollabSection/>
      <ArtistDropSection/>
      <FeaturedCarousel/>
      <CreatorCTASection/>
      <Footer/>
    </div>
  )
}

export default App