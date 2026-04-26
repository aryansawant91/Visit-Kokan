import HeroSection from '@/components/home/HeroSection'
import FeaturedDestinations from '@/components/home/FeaturedDestinations'
import WhyKokan from '@/components/home/WhyKokan'
import FeaturedTreks from '@/components/home/FeaturedTreks'
import PopularListings from '@/components/home/PopularListings'
import SeasonalHighlights from '@/components/home/SeasonalHighlights'
import LatestBlogs from '@/components/home/LatestBlogs'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import FeaturedProducts from "@/components/home/FeaturedProducts"

export const metadata: Metadata = {
  title: 'Visit Kokan — Discover the Konkan Coast',
  description:
    'Explore pristine beaches, lush forests, ancient forts and rich Konkani culture. Book treks, homestays and local experiences on the Konkan coast.',
  openGraph: {
    images: ['/images/og-default.jpg'],
  },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedDestinations />
        <WhyKokan />
        <FeaturedTreks />
        <PopularListings />
        <SeasonalHighlights />
        <FeaturedProducts />
        <LatestBlogs />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}