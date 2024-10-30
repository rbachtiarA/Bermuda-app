'use client'
import { ICartItem } from "@/type/cart";
import { Button, Checkbox, Skeleton } from "@nextui-org/react"
import React, { useRef, useState } from "react";
import {Card, CardBody} from "@nextui-org/react";
import { useAppDispatch } from "@/redux/hook";
import { removedFromCart } from "@/redux/slice/cartSlice";
import Image from "next/image";
import { deleteCartItem } from "@/lib/cart";
import CartQuantityInput from "./cartQuantityInput";
import currencyRupiah from "@/lib/rupiahCurrency";

export default function CartCard({cart, onSelectCartItem}: {cart: ICartItem, onSelectCartItem:any}) {
    const checkRef = useRef<HTMLInputElement>(null)
    const [isChecked, setIsChecked] = useState(false)
    const dispatch = useAppDispatch()
    const product = cart.product

    const onPressedCard = () => {
        const checked = !isChecked
        setIsChecked(checked)
        onSelectCartItem(checked, cart.id)
    }

    const onRemovedItem = async (cartItemId: number) => {
        const checked = false
        const { data } = await deleteCartItem(cartItemId)
        dispatch(removedFromCart(data.data))
        setIsChecked(checked)
        onSelectCartItem(checked, cart.productId)
    }

const nextUICardV2: React.ReactNode = 
    <Card isHoverable className="w-full">
        <CardBody >
            <div className="flex gap-4">
                <Checkbox size="sm" ref={checkRef} value={`${cart.productId}`} isSelected={isChecked} onClick={onPressedCard} className="md:hidden"/>
                <Checkbox size="lg" ref={checkRef} value={`${cart.productId}`} isSelected={isChecked} onClick={onPressedCard} className="hidden md:block"/>
                <div className="flex w-full gap-x-2 justify-center items-center">
                    <div className="">
                        <Skeleton className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]" />
                    </div>
                    <div className="flex flex-col w-full h-full justify-between">
                        <div>
                            <p className="text-wrap">{product?.name || 'Product Name Null'}</p>
                            <p className="font-extrabold">{currencyRupiah(product?.price!) || 'Product Price Null'}</p>
                        </div>
                        <div className="w-full grid grid-cols-2">
                            <Button color="danger" onPress={() => onRemovedItem(cart.id)} size="sm" isIconOnly><Image src={'/icon-trashcan.svg'} alt="delete" width={24} height={24} /></Button>
                            <CartQuantityInput defaultQuantity={cart.quantity} cart={cart}/>
                        </div>
                    </div>
                </div>
            </div>
        </CardBody>
    </Card>
    return (
        <li className="flex flex-col gap-x-4">
            {nextUICardV2}
        </li>        
    )
    
}