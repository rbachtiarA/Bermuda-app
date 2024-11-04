'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import CartCard from "./cartCard"
import { useEffect, useMemo, useState } from "react"
import { getAllCartItems, postCheckoutItems } from "@/lib/cart"
import { updatedCartFromDatabase } from "@/redux/slice/cartSlice"
import CartCheckout from "./cartCheckout"
import { useRouter } from "next/navigation"
import { resetCheckout, selectedAllItems } from "@/redux/slice/checkoutSlice"
import { Button, Card, CardBody, Checkbox } from "@nextui-org/react"
export default function CartList() {
    const user = useAppSelector(state => state.user)
    const cart = useAppSelector(state => state.cart)
    const store = useAppSelector(state => state.store)
    const checkout = useAppSelector(state => state.checkout)
    const dispatch = useAppDispatch()    
    const router = useRouter()    

    const onSelectAll = () => {
        const allItemsId = cart.map((item) => item.id)
        if(checkout.length === cart.length) {
            dispatch(resetCheckout())
        } else {
            dispatch(selectedAllItems(allItemsId))
        }
    }

    const onCheckout = async () => {
            const res = await postCheckoutItems(user.id, checkout)
            router.push('/cart/checkout')
    }
                    
    const totalSelectedItemsAmount = useMemo(() => {
        
        return cart.filter((item) => checkout.includes(item.id)).reduce((total, item) => total + item.quantity * item.product?.price!, 0)
    }, [checkout, cart])

    useEffect(() => {
        const getData = async () => {
            const data = await getAllCartItems(user.id, store.id)
            dispatch(updatedCartFromDatabase(data))
        }

        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="grid grid-cols-1 md:grid-cols-[4fr_2fr] lg:grid-cols-[1fr_4fr_2fr] w-full max-w-[1500px] mt-2 md:gap-2 md:px-2 ">
            <div className="lg:col-start-2">
                {cart.length === 0 && <p>Cart is Empty</p>}
                    <div className="sticky top-2 z-10 px-2">
                        <Card>
                            <CardBody>
                                <div className="flex justify-between">
                                    <Checkbox  onValueChange={onSelectAll} isIndeterminate={checkout.length > 0 && checkout.length !== cart.length} isSelected={cart.length === checkout.length}>Semua</Checkbox>
                                    {checkout.length !== 0 && <Button color="danger" variant="light" size="sm" className="max-h-6">Hapus</Button>}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <ul className="grid grid-rows-[auto] gap-y-4 p-2">
                        {cart.map((cartItem, idx) => (
                            <CartCard key={idx} cart={cartItem} checkout={checkout}/>
                    
                        ))}
                    </ul>
            </div>
            <div className="sticky bottom-[56px] md:bottom-[100vw]">
                <CartCheckout totalPayment={totalSelectedItemsAmount} checkout={checkout} onCheckout={onCheckout}/>
            </div>
        </section>
    )
}