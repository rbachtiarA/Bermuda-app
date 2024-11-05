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

export default function CartQuantityInput({cart}: { cart: ICartItem}) {
    const user = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const productStock = cart.product?.stock![0].quantity!
    const [quantity, setQuantity] = useState(cart.quantity)
    const [debouncedQuantity] = useDebounce(quantity, 1000)
    // isDebouncing for css purpose, when isDebounce it will change input bg color till debouncing finish
    const [isDebouncing, setIsDebouncing] = useState(false)
    
    // minus / plus button is pressed add value to quantity
    const onPressQuantityButton = (val:number) => {
        const tempQuantity = quantity+val
        if(tempQuantity > 0 && quantity <= productStock) {
            setQuantity(tempQuantity)
        }
    }

    // if input change manually
    const onChangeQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedQuantity = Number(e.target.value)
        setQuantity(updatedQuantity)            
    }

    // if input change manually into 0 or exceed stock, will reset to 1 when not focus
    const onBlurQuantity = () => {
        if(quantity === 0 || quantity > productStock ) {
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

        if(debouncedQuantity > 0 && debouncedQuantity <= productStock) {
            updatedQuantity()
        }
        setIsDebouncing(false)

    }, [debouncedQuantity])

    return (
        <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex w-full justify-end">
                <p className="text-[10px]"><span>Sisa item: </span> {productStock}</p>
            </div>
            <div className="flex gap-1 w-full justify-end">
                <Button size="sm" color={!isDebouncing? 'default': 'success'} isDisabled={quantity <= 1} isIconOnly onPress={() => onPressQuantityButton(-1)}><MinusIcon /></Button>
                <Input size="sm" type="number" color={!isDebouncing? 'default': 'success'}
                    onChange={(e) => onChangeQuantityInput(e)} onBlur={onBlurQuantity}
                    value={`${quantity}`} min={1} className="w-[50px] no-arrow-input" />
                <Button size="sm" color={!isDebouncing? 'default': 'success'} isDisabled={quantity >= productStock } isIconOnly onPress={() => onPressQuantityButton(1)}><PlusIcon /></Button>
            </div>
        </div>
    )
}