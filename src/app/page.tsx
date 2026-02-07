'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedItems from '@/components/FeaturedItems'
import Collections from '@/components/Collections'
import Footer from '@/components/Footer'
import DisplayItems from '@/components/itemobtain'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ProductGrid title="Featured Items" />
        {/* <DisplayItems /> */}
        {/* <FeaturedItems /> */}
        {/* <Collections /> */}
      </main>
      {/* <Footer /> */}
    </div>
  )
}
