'use client'

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-100 to-white py-16 md:py-24">
      <div className="container-mobile max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Hero Image Placeholder */}
          <div className="w-full aspect-video bg-gray-300 rounded-lg mb-8 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop"
              alt="Hero Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              Welcome to DeadStar
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Discover our curated collection of premium products, designed for the modern lifestyle.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition">
                Shop Now
              </button>
              <button className="px-8 py-3 border-2 border-black text-black font-semibold rounded hover:bg-gray-100 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
