import Navbar from '@/components/Navbar'
import { HttpTypes } from "@medusajs/types"
import ImageGalleryClient from './imageGallery'
import { sdk } from "@/lib/sdk"
import CartAdd from '@/components/AddToCart'
import FormattedPrice from '@/components/FormattedPrice'
type Params = { params: { handle: string } | Promise<{ handle: string }> }


export const revalidate = 300 // seconds

export default async function Product({ params }: Params) {
  const { handle } = await params
  const { regions } = await sdk.store.region.list()
  const region = regions?.[0]
  const { products } = await sdk.store.product.list({
    handle,
    region_id: region?.id,
  },{
    next: { tags: [`product-${handle}`], revalidate: 300 },
  })
  const product = products[0]

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-white">
        <Navbar />
        <main className="w-full flex justify-center">
          <div className="container-mobile w-full max-w-6xl mx-auto py-10 md:py-16">
            <p className="text-slate-600">Product not found.</p>
          </div>
        </main>
      </div>
    )
  }

  const variant = product?.variants?.[0]
  // const calculatedAmount = variant?.calculated_price?.calculated_amount
  // const fallbackAmount = variant?.prices?.[0]?.amount
  // const currencyCode = variant?.calculated_price?.currency_code || "usd"
  // const amount = calculatedAmount ?? fallbackAmount
  // const formattedPrice =
  //   typeof amount === "number"
  //     ? new Intl.NumberFormat("en-US", {
  //         style: "currency",
  //         currency: currencyCode.toUpperCase(),
  //       }).format(amount)
  //     : null
  const images = product.images.map ((img) => ({
    original: img.url,
    thumbnail: img.url,
  }))
  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="w-full flex justify-center">
        <div className="container-mobile w-full max-w-6xl mx-auto py-10 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="md:w-1/2 w-full">
              <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                <ImageGalleryClient images={images|| []} />
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {product.title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mt-4">
                <FormattedPrice product={product} />
              </h2>
              <CartAdd variant_id={variant.id} />
              <h3 className="text-lg md:text-xl font-medium text-slate-700 mt-2">
                {`Height: ${product.height} cm`}
              </h3>
              <h3 className="text-lg md:text-xl font-medium text-slate-700 mt-2">
                {`Width: ${product.width} cm`}
              </h3>
              <h3 className="text-lg md:text-xl font-medium text-slate-700 mt-2">
                {`Length: ${product.length} cm`}
              </h3>

              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
