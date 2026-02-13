"use client"

import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import StripePayment from "@/components/Stripe"
import { useCart } from "@/components/CartProvider"
import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"

export default function CheckoutPaymentPage() {
  const { cart, setCart } = useCart()
  const [paymentProviders, setPaymentProviders] = useState<
    HttpTypes.StorePaymentProvider[]
  >([])
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<
    string | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cart) {
      return
    }

    sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id || "",
    })
    .then(({ payment_providers }) => {
      setPaymentProviders(payment_providers)
      const existingProvider = cart.payment_collection?.payment_sessions?.[0]
        ?.provider_id
      setSelectedPaymentProvider(
        existingProvider || payment_providers?.[0]?.id
      )
    })
    .catch((err) => {
      console.error(err)
      setError("Could not load payment providers.")
    })
  }, [cart])

  const activePaymentSession = useMemo(() => {
    return cart?.payment_collection?.payment_sessions?.[0]
  }, [cart])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!cart || !selectedPaymentProvider) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await sdk.store.payment.initiatePaymentSession(cart, {
        provider_id: selectedPaymentProvider,
      })
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id)
      setCart(updatedCart)
    } catch (err) {
      console.error(err)
      setError("Could not initialize payment session.")
    } finally {
      setLoading(false)
    }
  }

  const showStripe = activePaymentSession?.provider_id?.startsWith(
    "pp_stripe_"
  )

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="w-full flex justify-center">
        <div className="container-mobile w-full max-w-3xl mx-auto py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Payment
          </h1>

          {!cart && (
            <p className="mt-6 text-slate-600">Loading your cart...</p>
          )}

          {cart && (
            <div className="mt-8 space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="text-sm font-medium text-slate-800">
                  Payment Provider
                </label>
                <select
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                  value={selectedPaymentProvider}
                  onChange={(e) => setSelectedPaymentProvider(e.target.value)}
                >
                  {paymentProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.id}
                    </option>
                  ))}
                </select>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  className="px-4 py-2 bg-slate-900 text-white rounded-md disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Preparing..." : "Continue"}
                </button>
              </form>

              {showStripe && (
                <div className="border border-slate-200 rounded-md p-4">
                  <StripePayment />
                </div>
              )}

              {!showStripe && activePaymentSession && (
                <p className="text-slate-600 text-sm">
                  Selected provider: {activePaymentSession.provider_id}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
