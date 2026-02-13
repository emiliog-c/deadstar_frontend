"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import { useCart } from "@/components/CartProvider"
import CartRemove from "@/components/RemoveFromCart"
import { FiTrash2 } from "react-icons/fi"

export default function CartPage() {
  const { cart } = useCart()

  const canCheckout = Boolean(
    cart && cart.items && cart.items.length > 0
  )

  const currencyCode = cart?.currency_code || "AUD"
  const formatPrice = (amount?: number | null) => {
    if (typeof amount !== "number") {
      return "-"
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="w-full flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-32 mx-auto py-10 md:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Your Cart
          </h1>

          {!cart && (
            <p className="mt-6 text-slate-600">Loading your cart...</p>
          )}

          {cart && (!cart.items || cart.items.length === 0) && (
            <p className="mt-6 text-slate-600">Your cart is empty.</p>
          )}

          {cart && cart.items && cart.items.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                {cart.items.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-start gap-2 sm:gap-4 border border-slate-200 rounded-lg p-3 sm:p-4"
                  >
                    {/* Remove button (trash icon) on left */}
                    <div className="pt-1 flex-shrink-0">
                      <CartRemove lineItemId={product.id} icon={true} />
                    </div>

                    {/* Product image */}
                    <div className="w-16 sm:w-24 md:w-28 h-auto bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={product.thumbnail || null}
                        alt={product.title || "Cart item"}
                        className="w-full h-auto object-cover"
                      />
                    </div>

                    {/* Product title */}
                    <div className="flex-grow min-w-0">
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 line-clamp-2">
                        {product.title || product.variant?.title || "Item"}
                      </h2>
                    </div>

                    {/* Price on right */}
                    <div className="text-slate-800 font-medium text-right flex-shrink-0 text-sm sm:text-base">
                      ${product.unit_price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-1 text-slate-800 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cart.tax_total)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {canCheckout ? (
              <Link
                href="/checkout/address"
                className="px-4 py-2 bg-slate-900 text-white rounded-md"
              >
                Checkout
              </Link>
            ) : (
              <button
                className="px-4 py-2 bg-slate-200 text-slate-500 rounded-md cursor-not-allowed"
                disabled
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}