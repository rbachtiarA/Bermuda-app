'use client'
import { useAppSelector } from "@/redux/hook"
import CartCard from "./cartCard"
import { useEffect, useState } from "react"
import { getAllCartItems } from "@/lib/cart"
import { ICartItem } from "@/type/cart"
export default function CartList() {
    const user = useAppSelector(state => state.user)
    console.log(user);
    
    // const cart = useAppSelector(state => state.cart)
    const [cart, setCart] = useState<ICartItem[]>([])
    const [checkout, setCheckout] = useState<number[]>([])
    const onCheckout = (checked:boolean, productId: number) => {
        if(checked) {
            setCheckout([...checkout, productId])
        } else {
            setCheckout([...checkout.filter((val) => val !== productId )])
        }
    }

    const getData = async () => {
        const data = await getAllCartItems(user.id)
        setCart(data)
    }
    useEffect(() => {
        getData()
    }, [])

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