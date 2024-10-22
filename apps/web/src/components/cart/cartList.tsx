'use client'
import { useAppSelector } from "@/redux/hook"
import CartCard from "./cartCard"
import { useState } from "react"
export default function CartList() {
    const cart = useAppSelector(state => state.cart)
    const [checkout, setCheckout] = useState<number[]>([])
    const onCheckout = (checked:boolean, productId: number) => {
        if(checked) {
            setCheckout([...checkout, productId])
        } else {
            setCheckout([...checkout.filter((val) => val !== productId )])
        }
    }

    return (
        <section>
            {cart.length === 0 && <p>Cart is Empty</p>}
            <ul className="grid grid-rows-[auto] gap-y-4 p-2 mt-2">
                {cart.map((item, idx) => (
                    <CartCard key={idx} cart={item} onCheckout={onCheckout}/>
                    
                ))}
            </ul>
            <div>
                <p>Checkout Id</p>
                <p>{checkout.length !== 0 ? checkout.join(',') : 'empty checkout'}</p>
            </div>
        </section>
    )
    
}