"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutShippingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/checkout/address")
  }, [router])

  return null
}
