import { HttpTypes } from "@medusajs/types"

/**
 * Check if a product is in stock (local check)
 * Uses the first variant to check stock
 * A product is in stock if:
 * - The variant's manage_inventory is false (inventory tracking disabled), OR
 * - The variant's inventory_quantity is greater than 0
 * @param product - The store product to check
 * @returns true if the product is in stock, false otherwise
 */
export const isProductInStock = (
  product: HttpTypes.StoreProduct | undefined | null
): boolean => {
  if (!product) {
    return true
  }

  const variant = product.variants?.[0]
  if (!variant) {
    return true
  }

  return isVariantInStock(variant)
}

/**
 * Check if a variant is in stock (local check)
 * Only checks the local variant data, does not make API calls
 * A variant is in stock if:
 * - The variant's manage_inventory is false (inventory tracking disabled), OR
 * - The variant's inventory_quantity is greater than 0
 * If inventory_quantity is not available, defaults to in stock
 * @param variant - The variant to check
 * @returns true if the variant is in stock, false otherwise
 */
export const isVariantInStock = (
  variant: HttpTypes.StoreProductVariant | undefined | null
): boolean => {
  if (!variant) {
    return true // Default to in stock if no variant
  }

  // If manage_inventory is false, the variant is always in stock
  if (variant.manage_inventory === false) {
    return true
  }

  // If we don't have inventory_quantity data, default to in stock
  if (typeof variant.inventory_quantity !== "number") {
    return true
  }

  // Otherwise check if inventory_quantity is greater than 0
  return variant.inventory_quantity > 0
}

/**
 * Check if a variant is in stock via API (real-time check)
 * Makes an API call to get the latest stock information from the server
 * Useful for client-side components that need real-time stock data
 * @param productId - The ID of the product
 * @param variantId - The ID of the variant to check
 * @returns Promise resolving to true if in stock, false if out of stock
 */
export const checkVariantStockRealtime = async (
  productId: string | undefined,
  variantId: string | undefined
): Promise<boolean> => {
  if (!productId || !variantId) {
    console.warn(`Missing IDs for stock check: productId=${productId}, variantId=${variantId}`)
    return true // Default to in stock if no IDs provided
  }

  try {
    console.log(`Making stock check API call for productId=${productId}, variantId=${variantId}`)
    const response = await fetch("/api/check-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, variantId }),
    })

    console.log(`Stock API response status: ${response.status}`)

    if (!response.ok) {
      console.error("Failed to check stock:", response.statusText)
      return true // Default to in stock if API fails
    }

    const data = await response.json()
    console.log(`Stock API response data:`, data)
    return data.inStock
  } catch (error) {
    console.error("Error checking stock:", error)
    return true // Default to in stock if there's an error
  }
}
