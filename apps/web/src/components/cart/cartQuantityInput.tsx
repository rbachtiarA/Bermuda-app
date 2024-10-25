'use client'
import { Button, Input } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import PlusIcon from "../icon/PlusIcon";
import MinusIcon from "../icon/MinusIcon";
import { updateCartItem } from "@/lib/cart";
import { ICartItem } from "@/type/cart";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updatedCartQuantity } from "@/redux/slice/cartSlice";
import { useDebounce } from "use-debounce";

export default function CartQuantityInput({defaultQuantity, cart}: { cart: ICartItem,defaultQuantity: number }) {
    const user = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    
    const [quantity, setQuantity] = useState(defaultQuantity)
    const [debouncedQuantity] = useDebounce(quantity, 1000)
    // isDebouncing for css purpose, when isDebounce it will change input bg color till debouncing finish
    const [isDebouncing, setIsDebouncing] = useState(false)

    // minus / plus button is pressed add value to quantity
    const onPressQuantityButton = (val:number) => {
        const tempQuantity = quantity+val
        if(tempQuantity > 0) {
            setQuantity(tempQuantity)
        }
    }

    // if input change manually
    const onChangeQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedQuantity = Number(e.target.value)
        setQuantity(updatedQuantity)            
    }

    // if input change manually into 0, will reset to 1 when not focut
    const onBlurQuantityZero = () => {
        if(quantity === 0) {
            setQuantity(1)
        }
    }

    // for animation purpose
    useEffect(() => {
        setIsDebouncing(true)
    }, [quantity])

    // every time quantity change, it will debounce for 500ms, then change debounceQuantity, 
    // then update database with current debouncedQuantity. if debounceQuantity 0, do not update database
    useEffect(() => {
        const updatedQuantity = async () => {
            const productId = cart.product?.id
            if(productId) {
                await updateCartItem(user.id, productId, debouncedQuantity)
                dispatch(updatedCartQuantity({productId, quantity: debouncedQuantity}))
            }
        }
        if(debouncedQuantity > 0) {
            updatedQuantity()
        }
        setIsDebouncing(false)

    }, [debouncedQuantity])

    return (
        <div className="flex gap-1 w-full justify-end">
            <Button size="sm" color={!isDebouncing? 'default': 'success'} isDisabled={quantity <= 1} isIconOnly onPress={() => onPressQuantityButton(-1)}><MinusIcon /></Button>
            <Input size="sm" type="number" color={!isDebouncing? 'default': 'success'}
                onChange={(e) => onChangeQuantityInput(e)} onBlur={onBlurQuantityZero} 
                value={`${quantity}`} min={1} className="w-[50px] no-arrow-input" />
            <Button size="sm" color={!isDebouncing? 'default': 'success'} isIconOnly onPress={() => onPressQuantityButton(1)}><PlusIcon /></Button>
        </div>
    )
}