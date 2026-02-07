import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'DeadStar - Premium Products',
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
        {children}
      </body>
    </html>
  )
}
