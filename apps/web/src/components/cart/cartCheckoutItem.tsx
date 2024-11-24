'use client'

import currencyRupiah from "@/lib/rupiahCurrency"
import { useAppSelector } from "@/redux/hook"
import { useMemo } from "react"

export default function CartCheckoutItem() {
    const cart = useAppSelector(state => state.cart)
    const checkout = useAppSelector(state => state.checkout)
    const selectedCart = useMemo(() => {
        return cart.filter((item) => checkout.includes(item.id))
    }, [checkout, cart])
    if(cart.length === 0) return (<></>)
    return (
        <div>
            {selectedCart.map((item) => (
                <div key={item.id} className="flex justify-between">
                    <p className="max-w-[200px] line-clamp-1">{item.product?.name}</p>
                    <p>{item.quantity} x {currencyRupiah(item.product?.price!)}</p>
                </div>
            ))}
        </div>
    )
}