import { getToken } from "./server"

export const getAvailableDiscountOnCheckout = async (storeId: number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}discount/store/${storeId}`, {
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        },
        next: {revalidate: 1}})
    const { status, discount } = await res.json()

    return { status, discount }
} 