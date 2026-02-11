import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col items-center">
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
