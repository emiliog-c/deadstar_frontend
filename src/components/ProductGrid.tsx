'use client'

import DisplayItems from './itemobtain'

interface ProductGridProps {
  title?: string
}

export default function ProductGrid({ title }: ProductGridProps) {
  return (
    <section className="w-full py-12 md:py-16 flex justify-center">
      <div className="container-mobile w-full max-w-6xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
            {title}
          </h2>
        )}

        {/* 2-Column Grid - Mobile first */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 w-full justify-items-center">
          <DisplayItems />
        </div>
      </div>
    </section>
  )
}
