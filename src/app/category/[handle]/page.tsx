import Navbar from '@/components/Navbar'
import { HttpTypes } from "@medusajs/types"
import ImageGalleryClient from './imageGallery'
import { sdk } from "@/lib/sdk"
import CartAdd from '@/components/AddToCart'
import CollectionTable from '@/components/CategoryGrid'
type Params = { params: { handle: string } | Promise<{ handle: string }> }


export default async function Collections({ params }: Params) {
    const { handle } = await params

    return (
        <div className="w-full min-h-screen bg-white">
        <Navbar />
        <main className="w-full flex justify-center">
            <div className="container-mobile w-full max-w-6xl mx-auto py-10 md:py-16">
            <CollectionTable handle={handle} />
            </div>
        </main>
        </div>
    )
}