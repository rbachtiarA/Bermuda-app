'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import CartCard from "./cartCard"
import { useEffect, useMemo, useState } from "react"
import { getAllCartItems } from "@/lib/cart"
import { updatedCartFromDatabase } from "@/redux/slice/cartSlice"
import CartCheckout from "./cartCheckout"
export default function CartList() {
    const user = useAppSelector(state => state.user)
    const cart = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()    
    const [checkout, setCheckout] = useState<number[]>([])

    const totalCheckoutAmount = useMemo(() => {
        
        return cart.filter((item) => checkout.includes(item.id)).reduce((total, item) => total + item.quantity * item.product?.price!, 0)
    }, [checkout, cart])
    // const [cart, setCart] = useState<ICartItem[]>([])

    const onCheckout = (checked:boolean, cartItemId: number) => {
        if(checked) {
            setCheckout([...checkout, cartItemId])
        } else {
            setCheckout([...checkout.filter((itemId) => itemId !== cartItemId )])
        }
    }

    
    useEffect(() => {
        const getData = async () => {
            const data = await getAllCartItems(user.id)
            console.log('fetching...');
            dispatch(updatedCartFromDatabase(data))
        }

        getData()
    }, [])

    return (
        <section className="grid md:grid-cols-[4fr_2fr] lg:grid-cols-[1fr_4fr_2fr]">
            <div className="lg:col-start-2">
                {cart.length === 0 && <p>Cart is Empty</p>}
                <ul className="grid grid-rows-[auto] gap-y-4 p-2 mt-2">
                    {cart.map((item, idx) => (
                        <CartCard key={idx} cart={item} onCheckout={onCheckout}/>
                        
                    ))}
                </ul>
            </div>
            <div className="sticky bottom-[56px] md:bottom-[100vw]">
                <CartCheckout totalPayment={totalCheckoutAmount} checkout={checkout} />
            </div>
        </section>
    )
}