import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white flex justify-center items-center">
      <div className="relative h-screen w-full"> {/* Parent container with defined dimensions */}
        <Image
          src="https://pub-9fff275bb0a04e8a815ba0f74fbf4159.r2.dev/s-l1200%20(1).jpg"
          alt="Hero image description"
          fill // Fills the parent container
          className="object-cover" // Ensures the image covers the entire space without distortion
          priority // Loads the image with high priority for LCP
        />
        <div className="container-mobile w-full max-w-6xl mx-auto flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">d_eadstar</h2>
          <Link
            href="/category/all_products"
            className="px-12 py-5 md:px-16 md:py-6 bg-slate-900 text-white text-lg md:text-xl font-semibold rounded-full hover:bg-slate-800 transition"
          >
            Shop All Products
          </Link>
        </div>

      </div>

    </section>
  )
}
