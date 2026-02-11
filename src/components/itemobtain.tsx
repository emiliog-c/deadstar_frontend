"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/sdk"



export default function DisplayItems() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    sdk.store.product.list({
      collection_id: "pcol_01KGP0V00A8HB48ZKRHY9ZB7HC",
      limit: 100,
      fields: "handle, id, title, thumbnail, images",
    })
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
      className="group cursor-pointer flex flex-col w-full max-w-[220px]"
    >
      {/* Product Image */}
      <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-2 md:mb-3 w-full aspect-square">
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