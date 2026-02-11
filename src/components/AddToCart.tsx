'use client'
import { sdk } from "../lib/sdk"

function addToCart(variant_id: string) {
  const cartId = localStorage.getItem("cart_id")

  if (!cartId) {
    return
  }

  sdk.store.cart.createLineItem(cartId, {
    variant_id,
    quantity: 1,
  })
  .then(({ cart }) => {
    // use cart
    console.log(cart)
    alert("Product added to cart")
  })
}

export default function CartAdd ({ variant_id }: { variant_id: string }) {
  return (
    <button onClick={() => addToCart(variant_id)}>
      Add to Cart
    </button>
  )
}