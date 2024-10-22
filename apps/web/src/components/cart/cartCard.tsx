import { ICartItem } from "@/type/cart";
import { Button, CardFooter, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from "@nextui-org/react"
import React, { useRef, useState } from "react";
import {Card, CardBody} from "@nextui-org/react";
import { IProduct } from "@/type/product";
import { useAppDispatch } from "@/redux/hook";
import { removedFromCart } from "@/redux/slice/cartSlice";
import Image from "next/image";
import CartModal from "./cartModal";

const productList: IProduct[] = [
    {id: 1, name: 'Apple', price: 5000},
    {id: 2, name: 'Banana', price: 7000},
    {id: 3, name: 'Carrot', price: 4000},
    {id: 4, name: 'Durian', price: 20000},
    {id: 5, name: 'Eggplant', price: 10000},
]

export default function CartCard({cart, onCheckout}: {cart: ICartItem, onCheckout:any}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const checkRef = useRef<HTMLInputElement>(null)
    const [isChecked, setIsChecked] = useState(false)
    const dispatch = useAppDispatch()
    const product = productList.find((product) => product.id === cart.productId)
    const onPressedCard = () => {
        const checked = !isChecked
        setIsChecked(checked)
        onCheckout(checked, cart.productId)
    }

    const onRemovedItem = () => {
        const checked = false
        dispatch(removedFromCart(cart))
        setIsChecked(checked)
        onCheckout(checked, cart.productId)
    }

    const nextUICard: React.ReactNode = 
    <Card isHoverable isPressable onPress={() => onPressedCard()} className="w-full">
        <CardBody >
            <div className="grid grid-cols-[auto_repeat(9,1fr)] justify-center items-center">
                <Checkbox size="sm" ref={checkRef} value={`${cart.productId}`} isSelected={isChecked} className="md:hidden"/>
                <Checkbox size="lg" ref={checkRef} value={`${cart.productId}`} isSelected={isChecked} className="hidden md:block"/>
                <div className="col-span-2 md:col-span-2">
                    <Skeleton className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]" />
                </div>
                <div className="col-start-5 md:col-start-4 col-span-3">
                    <p className="text-wrap">{product?.name || 'Product Name Null'}</p>
                    <p className="text-foreground-500">{product?.price || 'Product Price Null'}</p>
                </div>
                <div className="text-center col-span-2">
                    <p>Qty</p>
                    <p className="text-foreground-500">{cart.quantity}</p>
                </div>
                <div className="">
                    <p>Total Price</p>
                    <p className="font-bold">{product?.price ? product.price*cart.quantity: 0}</p>
                </div>
            </div>
        </CardBody>
    </Card>

    return (
        <li className="grid grid-cols-[7fr_1fr] items-center gap-x-4">
            {nextUICard}
            <div className="flex flex-col gap-2">
                <Button color="secondary" onPress={onOpen} isIconOnly><Image src={'/icon-edit.svg'} alt="delete" width={24} height={24}></Image></Button>
                <Button color="danger" onClick={onRemovedItem} isIconOnly><Image src={'/icon-trashcan.svg'} alt="delete" width={24} height={24}></Image></Button>
            </div>
            <CartModal isOpen={isOpen} onOpenChange={onOpenChange} product={product!} cart={cart} />
        </li>        
    )
    
}