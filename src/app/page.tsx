import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stack from '@/components/Stack'
import CollabSection from '@/components/CollabSection'
import ArtistDropSection from '@/components/ArtistDropSection'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import CreatorCta from '@/components/CreatorCta'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stack />
      <CollabSection />
      <ArtistDropSection />
      <FeaturedCarousel />
      <CreatorCta />
      <Footer />
    </div>
  )
}
