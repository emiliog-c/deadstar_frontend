"use client" // include with Next.js 13+

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { useRegion } from "./RegionContext"
import { sdk } from "@/lib/sdk"

// Type definition for the cart context value
type CartContextType = {
  cart?: HttpTypes.StoreCart // The current cart object
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  > // Function to directly set cart state
  refreshCart: () => Promise<void> // Function to manually refresh cart from backend
  clearCart: () => void // Function to clear and reset the cart
}

// Create the context that will be consumed by useCart hook
const CartContext = createContext<CartContextType | null>(null)

type CartProviderProps = {
  children: React.ReactNode
}

// CartProvider component wraps the app and manages cart state
export const CartProvider = ({ children }: CartProviderProps) => {
  // State to store the current cart
  const [cart, setCart] = useState<
    HttpTypes.StoreCart
  >()
  // Get the region from RegionContext (needed to create/manage carts)
  const { region } = useRegion()

  // Effect: Initialize or retrieve cart when component mounts or region changes
  useEffect(() => {
    // Skip if cart already loaded or region not available
    if (cart || !region) {
      return
    }

    // Check if a cart ID exists in localStorage
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) {
      // No cart ID: create a new cart for this region
      sdk.store.cart.create({
        region_id: region.id,
      })
      .then(({ cart: dataCart }) => {
        // Store the cart ID in localStorage for future sessions
        localStorage.setItem("cart_id", dataCart.id)
        // Update state with the new cart
        setCart(dataCart)
      })
    } else {
      // Cart ID exists: retrieve the existing cart from the backend
      sdk.store.cart.retrieve(cartId)
      .then(({ cart: dataCart }) => {
        // Update state with the retrieved cart
        setCart(dataCart)
      })
    }
  }, [cart, region])

  // Function to manually refresh cart from backend with full fields
  const refreshCart = async () => {
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) {
      return
    }

    try {
      const { cart: freshCart } = await sdk.store.cart.retrieve(cartId, {
        fields: "+items.*",
      })
      setCart(freshCart)
    } catch (error) {
      console.error("Failed to refresh cart:", error)
    }
  }

  // Function to clear the cart (called after order completion)
  const clearCart = () => {
    // Remove cart ID from storage
    localStorage.removeItem("cart_id")
    // Reset cart state to undefined, triggering a new cart creation on next mount
    setCart(undefined)
  }

  // Provide cart context to all children
  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      refreshCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to access cart context from any component
export const useCart = () => {
  // Get the context value
  const context = useContext(CartContext)

  // Error boundary: ensure hook is used within CartProvider
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}