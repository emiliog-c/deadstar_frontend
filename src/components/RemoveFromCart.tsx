"use client"

import { sdk } from "../lib/sdk"
import { useCart } from "./CartProvider"
import { FiTrash2 } from "react-icons/fi"

function removeFromCart(lineItemId: string, onRemoved: (cartId: string) => void) {
  const cartId = localStorage.getItem("cart_id")

  if (!cartId) {
    return
  }

  sdk.store.cart.deleteLineItem(cartId, lineItemId)
    .then(() => {
      onRemoved(cartId)
    })
}

export default function CartRemove({ lineItemId, icon }: { lineItemId: string; icon?: boolean }) {
  const { setCart } = useCart()

  const handleRemove = () => {
    removeFromCart(lineItemId, (cartId) => {
      sdk.store.cart.retrieve(cartId, { fields: "+items.*" }).then(({ cart }) => {
        setCart(cart)
      })
    })
  }

  if (icon) {
    return (
      <button 
        onClick={handleRemove}
        className="text-slate-600 hover:text-red-600 transition-colors"
        title="Remove from cart"
      >
        <FiTrash2 size={20} />
      </button>
    )
  }

  return (
    <button onClick={handleRemove}>
      Remove from Cart
    </button>
  )
}