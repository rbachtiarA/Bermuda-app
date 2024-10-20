'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import CartCard from "./cartCard"

export default function CartList() {
    const cart = useAppSelector(state => state.cart)

    return (
        <ul>
            {cart.map((item, idx) => (
                <CartCard key={idx} cart={item} />
            ))}
        </ul>
    )
    
}