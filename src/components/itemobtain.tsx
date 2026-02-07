"use client"

import { useEffect, useState } from "react"
import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})


export default function DisplayItems() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    sdk.store.product.list()
      .then(({ products, count, offset, limit }) => {
        setProducts(products)
        console.log(products)
      })
      .catch((error) => {
        console.error("Error fetching products:", error)
      })
  }, [])

  return products.map((product) => (
    <div
      key={product.id}
      className="group cursor-pointer flex flex-col w-full"
    >
      {/* Product Image */}
      <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-2 md:mb-3" style={{ width: '140px', height: '140px' }}>
        <img
          src={product.thumbnail || ''}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Product Name */}
        <h3 className="text-sm md:text-base font-semibold text-black line-clamp-2">
          {product.title}
        </h3>

        {/* Product Price */}
        {product.variants && product.variants[0]?.prices && (
          <p className="text-base md:text-lg font-bold text-black">
            ${(product.variants[0].prices[0]?.amount / 100).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  ))
} 