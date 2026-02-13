import type { Metadata } from 'next'
import '@/styles/globals.css'
import { RegionProvider } from '@/components/RegionContext'
import { CartProvider } from '@/components/CartProvider'
export const metadata: Metadata = {
  title: 'd_eadstar ✫',
  description: 'Discover our curated collection of premium products for the modern lifestyle.',
  keywords: 'shopping, ecommerce, products, store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RegionProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </RegionProvider>
      </body>
    </html>
  )
}
