"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/sdk"

type Props = {
  title?: string
}


export default function FeaturedItems({ title }: { title?: string }) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sdk.store.product.list({
      collection_id: "pcol_01KGP0V00A8HB48ZKRHY9ZB7HC",
      limit: 100,
    })
      .then(({ products: dataProducts }) => {
        setProducts(dataProducts)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching products:", error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (!products || products.length === 0) {
    return <div>No products in this collection</div>
  }

  return (
    <section>
      <h2>{title || "Featured Items"}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.images && product.images.length > 0 && (
              <img 
                src={product.images[0].url} 
                alt={product.title}
              />
            )}
            <h3>{product.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
