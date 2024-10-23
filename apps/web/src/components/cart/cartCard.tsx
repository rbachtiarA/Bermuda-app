import { ICartItem } from "@/type/cart";
import { Button, CardFooter, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from "@nextui-org/react"
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {Card, CardBody} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { removedFromCart } from "@/redux/slice/cartSlice";
import Image from "next/image";
import PlusIcon from "../icon/PlusIcon";
import MinusIcon from "../icon/MinusIcon";
import { deleteCartItem, updateCartItem } from "@/lib/cart";

const IDR = new Intl.NumberFormat('en-id', {
    style: 'currency',
    currency: 'IDR'
  })

export default function CartCard({cart, onCheckout}: {cart: ICartItem, onCheckout:any}) {
    const user = useAppSelector(state => state.user)
    const checkRef = useRef<HTMLInputElement>(null)
    const [isChecked, setIsChecked] = useState(false)
    const [quantity, setQuantity] = useState(cart.quantity)
    const dispatch = useAppDispatch()
    const product = cart.product

    const onPressedCard = () => {
        const checked = !isChecked
        setIsChecked(checked)
        onCheckout(checked, cart.productId)
    }

    const onRemovedItem = async (cartItemId: number) => {
        const checked = false
        // dispatch(removedFromCart(cart))
        const res = await deleteCartItem(cartItemId)
        setIsChecked(checked)
        onCheckout(checked, cart.productId)
    }


    const onPressQuantityButton = (val:number) => {
        const tempQuantity = quantity+val
        if(tempQuantity > 0) {
            setQuantity(tempQuantity)
        }
    }

    const onChangeQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedQuantity = Number(e.target.value)
        setQuantity(Number(updatedQuantity))        
    }
    
    const updatedQuantity = async () => {
        const res = await updateCartItem(user.id, product?.id!, quantity)
        console.log(res);
    }
    useEffect(() => {
        updatedQuantity()
    }, [quantity])

const nextUICardV2: React.ReactNode = 
    <Card isHoverable onPress={() => onPressedCard()} className="w-full">
        <CardBody >
            <div className="flex gap-4">
                <Checkbox size="sm" ref={checkRef} value={`${cart.productId}`} isSelected={isChecked} onClick={onPressedCard} className="md:hidden"/>
                <Checkbox size="lg" ref={checkRef} value={`${cart.productId}`} isSelected={isChecked} onClick={onPressedCard} className="hidden md:block"/>
                <div className="flex w-full gap-x-2 justify-center items-center">
                    <div className="">
                        <Skeleton className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]" />
                    </div>
                    <div className="flex flex-col w-full">
                        <div>
                            <p className="text-wrap">{product?.name || 'Product Name Null'}</p>
                            <p className="font-extrabold">{IDR.format(product?.price!) || 'Product Price Null'}</p>
                        </div>
                        <div className="flex gap-2">
                            {/* <Button color="secondary" onPress={onOpen} size="sm" isIconOnly><EditIcon /></Button> */}
                            <Button color="danger" onClick={() => onRemovedItem(cart.id)} size="sm" isIconOnly><Image src={'/icon-trashcan.svg'} alt="delete" width={24} height={24}></Image></Button>
                            <div className="flex gap-1">
                                <Button size="sm" color="default" isDisabled={quantity <= 1} isIconOnly onPress={() => onPressQuantityButton(-1)}><MinusIcon /></Button>
                                <Input size="sm" type="number" onChange={(e) => onChangeQuantityInput(e)} value={`${quantity}`} min={1} />
                                <Button size="sm" color="default" isIconOnly onPress={() => onPressQuantityButton(1)}><PlusIcon /></Button>
                            </div>
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