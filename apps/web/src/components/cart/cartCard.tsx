'use client'
import { ICartItem } from "@/type/cart";
import { Button, Checkbox, Skeleton, Tooltip } from "@nextui-org/react"
import React, { useEffect, useRef, useState } from "react";
import {Card, CardBody} from "@nextui-org/react";
import { useAppDispatch } from "@/redux/hook";
import { removedFromCart } from "@/redux/slice/cartSlice";
import Image from "next/image";
import { deleteCartItem } from "@/lib/cart";
import CartQuantityInput from "./cartQuantityInput";
import currencyRupiah from "@/lib/rupiahCurrency";
import { addSelectedCheckout, removeSelectedCheckout } from "@/redux/slice/checkoutSlice";

export default function CartCard({cart, checkout, soldOut}: {cart: ICartItem, checkout: number[], soldOut?: boolean}) {
    const dispatch = useAppDispatch()
    const checkRef = useRef<HTMLInputElement>(null)
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const product = cart.product

    const onPressedCard = () => {
        // const checked = !isChecked
        // setIsChecked(checked)
        if(!isChecked) {
            dispatch(addSelectedCheckout(cart.id))
        } else {
            dispatch(removeSelectedCheckout(cart.id))
        }
    }

    const onRemovedItem = async (cartItemId: number) => {
        const checked = false
        const { data } = await deleteCartItem(cartItemId)
        dispatch(removedFromCart(data.data))
        dispatch(removeSelectedCheckout(cartItemId))
        setIsChecked(checked)
    }
    
    useEffect(() => {
        setIsChecked(checkout.includes(cart.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[checkout])

    const nextUICardV2: React.ReactNode = 
    <Card isHoverable className="w-full">
        <CardBody >
            <div className="flex gap-4">
                <Checkbox size="sm" ref={checkRef} value={`${cart.productId}`} isDisabled={soldOut} isSelected={isChecked} onClick={onPressedCard} className="md:hidden"/>
                <Checkbox size="lg" ref={checkRef} value={`${cart.productId}`} isDisabled={soldOut} isSelected={isChecked} onClick={onPressedCard} className="hidden md:block"/>
                <div className="flex w-full gap-x-2 justify-center items-center">
                    <div className="">
                        <Skeleton className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]" />
                    </div>
                    <div className="flex flex-col w-full h-full justify-between">
                        <div>
                            <p className="text-balance max-w-[200px] md:max-w-none line-clamp-2 break-words">{product?.name || 'Product Name Null'}</p>
                            <p className="font-extrabold">{currencyRupiah(product?.price!) || 'Product Price Null'}</p>
                        </div>
                        <div className="w-full grid grid-cols-2 items-end">
                            <Tooltip content="Remove item" delay={0}>
                                <Button color="danger" onPress={() => onRemovedItem(cart.id)} size="sm" isIconOnly><Image src={'/icon-trashcan.svg'} alt="delete" width={24} height={24} /></Button>
                            </Tooltip>
                            <CartQuantityInput cart={cart}/>
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