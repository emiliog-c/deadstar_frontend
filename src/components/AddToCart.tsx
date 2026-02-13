'use client'
import { sdk } from "../lib/sdk"
import { useCart } from "./CartProvider"
import { useState } from "react"

export default function CartAdd ({ variant_id }: { variant_id: string }) {
  const { cart, setCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if variant is already in cart
  const isVariantInCart = (variantId: string): boolean => {
    return !!cart?.items?.some((item) => item.variant_id === variantId)
  }

  // Add item to cart using SDK response directly
  const handleAddToCart = async () => {
    const cartId = localStorage.getItem("cart_id")

    if (!cartId) {
      setError("Cart not initialized")
      return
    }

    // Check if already in cart
    if (isVariantInCart(variant_id)) {
      setError("Product is already in the cart")
      setTimeout(() => setError(null), 3000) // Clear error after 3 seconds
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Add item and get updated cart with full fields
      const { cart: updatedCart } = await sdk.store.cart.createLineItem(
        cartId,
        { variant_id, quantity: 1 },
        { fields: "+items.*" }
      )
      // Update cart context directly with response
      setCart(updatedCart)
      alert("Product added to cart")
    } catch (err) {
      console.error("Error adding to cart:", err)
      setError("Failed to add product to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full ring-1 ring-black bg-white text-black py-3 px-4 rounded-none font-semibold transition-all duration-200 cursor-pointer hover:ring-2 my-8 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
}