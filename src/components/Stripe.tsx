"use client"

import { 
  CardElement, 
  Elements, 
  useElements, 
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "./CartProvider"
import { useState } from "react"
import { sdk } from "@/lib/sdk"

const stripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PK || "temp"
)

export default function StripePayment() {
  const { cart } = useCart()
  const clientSecret = cart?.payment_collection?.
    payment_sessions?.[0].data.client_secret as string

  return (
    <div>
      <Elements stripe={stripe} options={{
          clientSecret,
        }}>
        <StripeForm clientSecret={clientSecret} />
      </Elements>
    </div>
  )
}

const StripeForm = ({ 
  clientSecret,
}: {
  clientSecret: string | undefined
}) => {
  const { cart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  async function handlePayment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault()
    const card = elements?.getElement(CardElement)

    if (
      !stripe || 
      !elements ||
      !card ||
      !cart ||
      !clientSecret
    ) {
      setErrorMessage("Stripe is not ready. Please try again.")
      console.warn("Stripe not ready", {
        hasStripe: Boolean(stripe),
        hasElements: Boolean(elements),
        hasCard: Boolean(card),
        hasCart: Boolean(cart),
        hasClientSecret: Boolean(clientSecret),
        providerId: cart?.payment_collection?.payment_sessions?.[0]?.provider_id,
      })
      return
    }

    setLoading(true)
    setErrorMessage(null)
    console.log("Stripe payment session", {
      providerId: cart.payment_collection?.payment_sessions?.[0]?.provider_id,
      hasClientSecret: Boolean(clientSecret),
      paymentSessionId: cart.payment_collection?.payment_sessions?.[0]?.id,
    })
    stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: cart.billing_address?.first_name,
          email: cart.email,
          phone: cart.billing_address?.phone,
          address: {
            city: cart.billing_address?.city,
            country: cart.billing_address?.country_code,
            line1: cart.billing_address?.address_1,
            line2: cart.billing_address?.address_2,
            postal_code: cart.billing_address?.postal_code,
          },
        },
      },
    })
    .then(({ error }) => {
      if (error) {
        console.error("Stripe confirmCardPayment error", error)
        setErrorMessage(error.message || "Payment failed. Try again.")
        return
      }

      sdk.store.cart.complete(cart.id)
      .then((data) => {
        if (data.type === "cart" && data.cart) {
          // an error occurred
          setErrorMessage(data.error || "Could not complete order.")
        } else if (data.type === "order" && data.order) {
          // Order successful - clear cart for new session
          alert("Order placed.")
          console.log(data.order)
          clearCart()
        }
      })
    })
    .finally(() => setLoading(false))
  }

  return (
    <form>
      <CardElement />
      {errorMessage && (
        <p className="mt-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
      <button 
        onClick={handlePayment}
        disabled={loading}
      >
        Place Order
      </button>
    </form>
  )
}