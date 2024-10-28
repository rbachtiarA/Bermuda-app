'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import CartCard from "./cartCard"
import { useEffect, useMemo, useState } from "react"
import { getAllCartItems, postCheckoutItems } from "@/lib/cart"
import { updatedCartFromDatabase } from "@/redux/slice/cartSlice"
import CartCheckout from "./cartCheckout"
import { redirect, useRouter } from "next/navigation"
export default function CartList() {
    const user = useAppSelector(state => state.user)
    const cart = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()    
    const [checkout, setCheckout] = useState<number[]>([])
    const  router = useRouter()

    const totalCheckoutAmount = useMemo(() => {
        
        return cart.filter((item) => checkout.includes(item.id)).reduce((total, item) => total + item.quantity * item.product?.price!, 0)
    }, [checkout, cart])
    // const [cart, setCart] = useState<ICartItem[]>([])

    const onSelectCartItem = (checked:boolean, cartItemId: number) => {
        if(checked) {
            setCheckout([...checkout, cartItemId])
        } else {
            setCheckout([...checkout.filter((itemId) => itemId !== cartItemId )])
        }
    }

    const onCheckout = async () => {
        const res = await postCheckoutItems(user.id, checkout)
        router.push('/cart/checkout')
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
        <section className="grid md:grid-cols-[4fr_2fr] lg:grid-cols-[1fr_4fr_2fr] w-full max-w-[1500px] md:px-2">
            <div className="lg:col-start-2">
                {cart.length === 0 && <p>Cart is Empty</p>}
                <ul className="grid grid-rows-[auto] gap-y-4 p-2 mt-2">
                    {cart.map((item, idx) => (
                        <CartCard key={idx} cart={item} onSelectCartItem={onSelectCartItem}/>
                        
                    ))}
                </ul>
            </div>
            <div className="sticky bottom-[56px] md:bottom-[100vw] mt-4">
                <CartCheckout totalPayment={totalCheckoutAmount} checkout={checkout} onCheckout={onCheckout}/>
            </div>
        </section>
    )
}