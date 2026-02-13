    
export default function FormattedPrice({ product }: { product: any }) {
    const variant = product?.variants?.[0]
    const calculatedAmount = variant?.calculated_price?.calculated_amount
    const fallbackAmount = variant?.prices?.[0]?.amount
    const currencyCode = variant?.calculated_price?.currency_code || "usd"
    const amount = calculatedAmount ?? fallbackAmount
    const formattedPrice =
    typeof amount === "number"
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode.toUpperCase(),
        }).format(amount)
        : null

    return <>{formattedPrice}</>
}