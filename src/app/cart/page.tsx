"use client"

import Navbar from "@/components/Navbar"
import { useCart } from "@/components/CartProvider"

export default function CartPage() {
  const { cart } = useCart()

  const currencyCode = cart?.currency_code || "usd"
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
        <div className="container-mobile w-full max-w-4xl mx-auto py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
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
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 rounded-lg p-4"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {item.title || item.variant?.title || "Item"}
                      </h2>
                      <p className="text-sm text-slate-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-slate-800 font-medium">
                      {formatPrice(item.total)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-1 text-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(cart.shipping_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cart.tax_total)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}