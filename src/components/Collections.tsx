'use client'

import { Collection } from '@/types/product'

interface CollectionsProps {
  collections?: Collection[]
}

export default function Collections({ collections }: CollectionsProps) {
  // Mock data - replace with real data from Medusa backend
  const mockCollections: Collection[] = collections || [
    {
      id: '1',
      name: 'Pants',
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      slug: 'pants',
    },
    {
      id: '2',
      name: 'Jackets',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
      slug: 'jackets',
    },
    {
      id: '3',
      name: 'Boots',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      slug: 'boots',
    },
    {
      id: '4',
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      slug: 'accessories',
    },
  ]

  return (
    <section id="collections" className="w-full py-12 md:py-16 bg-gray-50">
      <div className="container-mobile max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
          Collections
        </h2>

        {/* Collections Grid - 2 columns on mobile, 4 on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {mockCollections.map((collection) => (
            <div
              key={collection.id}
              className="group cursor-pointer"
            >
              {/* Collection Image */}
              <div className="relative aspect-square bg-gray-300 rounded-lg overflow-hidden mb-3">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </span>
                </div>
              </div>

              {/* Collection Name */}
              <h3 className="text-base md:text-lg font-semibold text-black text-center">
                {collection.name}
              </h3>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition">
            View All Collections
          </button>
        </div>
      </div>
    </section>
  )
}
