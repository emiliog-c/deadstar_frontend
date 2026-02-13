import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

export interface CategoryTableProps {
  handle?: string
}

const formatPrice = (product: HttpTypes.StoreProduct) => {
  const variant = product.variants?.[0]
  const calculatedAmount = variant?.calculated_price?.calculated_amount
  const fallbackAmount = variant?.prices?.[0]?.amount
  const currencyCode = variant?.calculated_price?.currency_code || "usd"
  const amount = calculatedAmount ?? fallbackAmount

  if (typeof amount !== "number") {
    return null
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

export default async function CategoryTable({
  handle,
}: CategoryTableProps) {
  const { regions } = await sdk.store.region.list()
  const regionId = regions?.[0]?.id
  const { product_categories } = await sdk.store.category.list({
    handle: handle || "all_products",
    fields: "id,handle,name",
  }, 
  { next: { tags: ["product_categories"], revalidate: 60 } })
  
  const category = product_categories?.[0]
  const title = category?.name 
  const { products } = category
    ? await sdk.store.product.list({
        category_id: category.id,
        limit: 100,
        region_id: regionId,
        fields:
          "handle, id, title, thumbnail, images, variants, variants.prices, variants.calculated_price, variants.calculated_price.calculated_amount, variants.calculated_price.currency_code",
      })
    : { products: [] as HttpTypes.StoreProduct[] }

  return (
    console.log(product_categories),
    <section className="w-full py-12 md:py-16 flex justify-center">
      <div className="container-mobile w-full max-w-12xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-2 lg:gap-2 w-full max-w-full md:max-w-[70vw] mx-auto justify-items-center">
          {products.map((product) => (
            <Link href={`/products/${product.handle}`} key={product.id}>
              <div className="group cursor-pointer flex flex-col w-full max-w-[260px] md:max-w-[420px] lg:max-w-[520px]">
                <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-2 md:mb-3 w-full aspect-[4/5]">
                  <img
                    src={product.thumbnail || null}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-semibold text-black line-clamp-2">
                    {product.title}
                  </h3>

                  {formatPrice(product) ? (
                    <p className="text-base md:text-lg font-bold text-black">
                      {formatPrice(product)}
                    </p>
                  ) : (
                    <p className="text-base md:text-lg font-bold text-black">
                      Price unavailable
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
