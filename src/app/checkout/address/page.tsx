"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Navbar from "@/components/Navbar"
import { useCart } from "@/components/CartProvider"
import { sdk } from "@/lib/sdk"

type AddressForm = {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  postal_code: string
  country_code: string
  phone: string
}

const emptyAddress: AddressForm = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  postal_code: "",
  country_code: "",
  phone: "",
}

const toAddressForm = (address?: HttpTypes.StoreAddress | null): AddressForm => ({
  first_name: address?.first_name || "",
  last_name: address?.last_name || "",
  address_1: address?.address_1 || "",
  address_2: address?.address_2 || "",
  city: address?.city || "",
  postal_code: address?.postal_code || "",
  country_code: address?.country_code || "",
  phone: address?.phone || "",
})

export default function CheckoutAddressPage() {
  const router = useRouter()
  const { cart, setCart } = useCart()
  const [email, setEmail] = useState("")
  const [shipping, setShipping] = useState<AddressForm>(emptyAddress)
  const [billing, setBilling] = useState<AddressForm>(emptyAddress)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreCartShippingOption[]
  >([])
  const [calculatedPrices, setCalculatedPrices] = useState<
    Record<string, number>
  >({})
  const [selectedShippingOption, setSelectedShippingOption] = useState<
    string | undefined
  >()
  const [error, setError] = useState<string | null>(null)

  const requiredMissing = useMemo(() => {
    const required = [
      email,
      shipping.first_name,
      shipping.last_name,
      shipping.address_1,
      shipping.city,
      shipping.postal_code,
      shipping.country_code,
    ]

    if (!sameAsShipping) {
      required.push(
        billing.first_name,
        billing.last_name,
        billing.address_1,
        billing.city,
        billing.postal_code,
        billing.country_code,
      )
    }

    return required.some((value) => !value.trim())
  }, [
    billing,
    email,
    sameAsShipping,
    shipping,
  ])

  useEffect(() => {
    if (!cart) {
      return
    }

    setEmail(cart.email || "")
    setShipping(toAddressForm(cart.shipping_address))
    setBilling(toAddressForm(cart.billing_address))
  }, [cart])

  useEffect(() => {
    if (!cart) {
      return
    }

    sdk.store.fulfillment.listCartOptions({
      cart_id: cart.id,
    })
    .then(({ shipping_options }) => {
      setShippingOptions(shipping_options)
      const existingOptionId = cart.shipping_methods?.[0]?.shipping_option_id
      setSelectedShippingOption(existingOptionId || shipping_options?.[0]?.id)
    })
    .catch((err) => {
      console.error(err)
      setError("Could not load shipping options.")
    })
  }, [cart])

  useEffect(() => {
    if (!cart || !shippingOptions.length) {
      return
    }

    const calculatedOptions = shippingOptions.filter(
      (option) => option.price_type === "calculated"
    )

    if (!calculatedOptions.length) {
      return
    }

    Promise.allSettled(
      calculatedOptions.map((option) =>
        sdk.store.fulfillment.calculate(option.id, {
          cart_id: cart.id,
          data: {},
        })
      )
    )
    .then((results) => {
      const nextPrices: Record<string, number> = {}
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          nextPrices[result.value.shipping_option.id] =
            result.value.shipping_option.amount
        }
      })
      setCalculatedPrices(nextPrices)
    })
    .catch((err) => console.error(err))
  }, [cart, shippingOptions])

  const updateShipping = (field: keyof AddressForm, value: string) => {
    setShipping((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateBilling = (field: keyof AddressForm, value: string) => {
    setBilling((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatPrice = (amount: number | undefined) => {
    if (!cart || typeof amount !== "number") {
      return "-"
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cart.currency_code.toUpperCase(),
    }).format(amount)
  }

  const getShippingOptionPrice = useCallback((
    option: HttpTypes.StoreCartShippingOption
  ) => {
    if (option.price_type === "flat") {
      return formatPrice(option.amount)
    }

    if (!calculatedPrices[option.id]) {
      return
    }

    return formatPrice(calculatedPrices[option.id])
  }, [calculatedPrices, cart])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!cart) {
      setError("Cart not ready yet.")
      return
    }

    if (requiredMissing) {
      setError("Please fill in all required fields.")
      return
    }

    if (!selectedShippingOption) {
      setError("Please select a shipping option.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const billingAddress = sameAsShipping ? shipping : billing
      const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
        email,
        shipping_address: shipping,
        billing_address: billingAddress,
      })
      const { cart: cartWithShipping } = await sdk.store.cart.addShippingMethod(
        updatedCart.id,
        {
          option_id: selectedShippingOption,
          data: {},
        }
      )
      setCart(cartWithShipping)
      router.push("/checkout/payment")
    } catch (err) {
      console.error(err)
      setError("Could not save checkout details. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="w-full flex justify-center">
        <div className="container-mobile w-full max-w-3xl mx-auto py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Address
          </h1>

          {!cart && (
            <p className="mt-6 text-slate-600">Loading your cart...</p>
          )}

          {cart && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="First name"
                    value={shipping.first_name}
                    onChange={(e) => updateShipping("first_name", e.target.value)}
                    required
                  />
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="Last name"
                    value={shipping.last_name}
                    onChange={(e) => updateShipping("last_name", e.target.value)}
                    required
                  />
                  <input
                    className="md:col-span-2 w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="Address line 1"
                    value={shipping.address_1}
                    onChange={(e) => updateShipping("address_1", e.target.value)}
                    required
                  />
                  <input
                    className="md:col-span-2 w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="Address line 2"
                    value={shipping.address_2}
                    onChange={(e) => updateShipping("address_2", e.target.value)}
                  />
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="City"
                    value={shipping.city}
                    onChange={(e) => updateShipping("city", e.target.value)}
                    required
                  />
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="Postal code"
                    value={shipping.postal_code}
                    onChange={(e) => updateShipping("postal_code", e.target.value)}
                    required
                  />
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="Country code (e.g. us)"
                    value={shipping.country_code}
                    onChange={(e) => updateShipping("country_code", e.target.value)}
                    required
                  />
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                    placeholder="Phone"
                    value={shipping.phone}
                    onChange={(e) => updateShipping("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="same-as-shipping"
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                />
                <label htmlFor="same-as-shipping" className="text-sm text-slate-700">
                  Billing address is the same as shipping
                </label>
              </div>

              {!sameAsShipping && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Billing Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="First name"
                      value={billing.first_name}
                      onChange={(e) => updateBilling("first_name", e.target.value)}
                      required
                    />
                    <input
                      className="w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="Last name"
                      value={billing.last_name}
                      onChange={(e) => updateBilling("last_name", e.target.value)}
                      required
                    />
                    <input
                      className="md:col-span-2 w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="Address line 1"
                      value={billing.address_1}
                      onChange={(e) => updateBilling("address_1", e.target.value)}
                      required
                    />
                    <input
                      className="md:col-span-2 w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="Address line 2"
                      value={billing.address_2}
                      onChange={(e) => updateBilling("address_2", e.target.value)}
                    />
                    <input
                      className="w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="City"
                      value={billing.city}
                      onChange={(e) => updateBilling("city", e.target.value)}
                      required
                    />
                    <input
                      className="w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="Postal code"
                      value={billing.postal_code}
                      onChange={(e) => updateBilling("postal_code", e.target.value)}
                      required
                    />
                    <input
                      className="w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="Country code (e.g. us)"
                      value={billing.country_code}
                      onChange={(e) => updateBilling("country_code", e.target.value)}
                      required
                    />
                    <input
                      className="w-full border border-slate-300 rounded-md px-3 py-2"
                      placeholder="Phone"
                      value={billing.phone}
                      onChange={(e) => updateBilling("phone", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Shipping Method
                </h2>
                {shippingOptions.length === 0 && (
                  <p className="text-sm text-slate-600">
                    No shipping options available yet.
                  </p>
                )}
                <div className="space-y-3">
                  {shippingOptions.map((option) => {
                    const price = getShippingOptionPrice(option)
                    return (
                      <label
                        key={option.id}
                        className="flex items-center justify-between gap-3 border border-slate-200 rounded-md px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping-option"
                            value={option.id}
                            checked={selectedShippingOption === option.id}
                            onChange={() => setSelectedShippingOption(option.id)}
                            disabled={price === undefined}
                          />
                          <span className="text-slate-800">
                            {option.name}
                          </span>
                        </div>
                        <span className="text-slate-700 text-sm">
                          {price || "Calculating..."}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                className="px-4 py-2 bg-slate-900 text-white rounded-md disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Continue to Payment"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
