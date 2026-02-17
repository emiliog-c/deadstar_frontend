import { sdk } from "@/lib/sdk"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { productId, variantId } = await request.json()

    if (!productId || !variantId) {
      return NextResponse.json(
        { error: "Product ID and Variant ID are required" },
        { status: 400 }
      )
    }

    // Get regions to fetch the product with correct context
    const { regions } = await sdk.store.region.list()
    const regionId = regions?.[0]?.id

    // Fetch the specific product with inventory details
    const { product } = await sdk.store.product.retrieve(
      productId,
      {
        region_id: regionId,
        fields: "id,handle,title,variants,variants.id,variants.manage_inventory,variants.inventory_quantity,variants.inventory_items,variants.inventory_items.inventory,variants.inventory_items.inventory.location_levels,variants.inventory_items.inventory.location_levels.stocked_quantity,variants.inventory_items.inventory.location_levels.reserved_quantity",
      }
    )

    console.log(`Stock check for product ${productId}, variant ${variantId}:`, { product, regionId })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Find the specific variant
    const variant = product.variants?.find((v) => v.id === variantId)

    console.log(`Found variant:`, variant)

    if (!variant) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      )
    }

    // Check if variant is in stock
    let inStock = true

    // If manage_inventory is false, always in stock
    if (variant.manage_inventory === false) {
      inStock = true
    } else {
      // Calculate available quantity from inventory items
      let totalStocked = 0
      let totalReserved = 0

      if (variant.inventory_items && variant.inventory_items.length > 0) {
        for (const invItem of variant.inventory_items) {
          if (invItem.inventory?.location_levels && invItem.inventory.location_levels.length > 0) {
            for (const locLevel of invItem.inventory.location_levels) {
              totalStocked += locLevel.stocked_quantity || 0
              totalReserved += locLevel.reserved_quantity || 0
            }
          }
        }
      }

      // Available = stocked - reserved
      const available = totalStocked - totalReserved
      inStock = available > 0
    }

    console.log(`Stock result: inStock=${inStock}, manage_inventory=${variant.manage_inventory}`)

    return NextResponse.json({
      inStock,
      variant: {
        id: variant.id,
        manage_inventory: variant.manage_inventory,
        inventory_quantity: variant.inventory_quantity,
      },
    })
  } catch (error) {
    console.error("Error checking stock:", error)
    return NextResponse.json(
      { error: "Failed to check stock", details: String(error) },
      { status: 500 }
    )
  }
}
