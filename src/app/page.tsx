import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ItemObtain from '@/components/CategoryGrid'

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col items-center">
        <Hero />
        <ItemObtain title="Featured Items" />
        {/* <DisplayItems /> */}
        {/* <FeaturedItems /> */}
        {/* <Collections /> */}
      </main>
      {/* <Footer /> */}
    </div>
  )
}
