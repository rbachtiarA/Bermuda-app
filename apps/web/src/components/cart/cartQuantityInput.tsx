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

export default function CartQuantityInput({cart, isLoading}: { cart: ICartItem, isLoading: 'DATA' | 'CHECKOUT' | null}) {
    const dispatch = useAppDispatch()
    //if product stock not in database yet, still readable for 0
    const productStock = cart.product?.stock![0] === undefined? 0 : cart.product?.stock![0].quantity!
    const [quantity, setQuantity] = useState(cart.quantity)
    const [debouncedQuantity] = useDebounce(quantity, 1000)
    // isDebouncing for css purpose, when isDebounce it will change input bg color till debouncing finish
    const [isDebouncing, setIsDebouncing] = useState(false)
    
    const updatedQuantity = async (qty: number) => {
        const productId = cart.product?.id
        if(productId) {
            await updateCartItem(productId, qty)
            dispatch(updatedCartQuantity({productId, quantity: debouncedQuantity}))
        }
        
    }

    // minus / plus button is pressed add value to quantity
    const onPressQuantityButton = (val:number) => {
        const tempQuantity = quantity+val
        //if quantity > productStock, instant change quantity to product stock
        if(tempQuantity > productStock) {
            setQuantity(productStock)
        }else if(tempQuantity > 0) {
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

        if(debouncedQuantity > 0 && debouncedQuantity <= productStock) {
           updatedQuantity(debouncedQuantity)
        }
        setIsDebouncing(false)

    }, [debouncedQuantity])

    useEffect(() => {
        if(productStock < quantity && productStock !== 0) {
            updatedQuantity(productStock)
            setQuantity(productStock)
        }
    },[])
    return (
        <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex w-full justify-end">
                <p className="text-[10px]"><span>Sisa item: </span> {productStock}</p>
            </div>
            <div className="flex gap-1 w-full justify-end">
                <Button size="sm" color={productStock < quantity? 'warning' : !isDebouncing? 'default': 'success'} isDisabled={quantity <= 1 || isLoading === 'CHECKOUT'} isIconOnly onPress={() => onPressQuantityButton(-1)}><MinusIcon /></Button>
                <Input size="sm" type="number" color={!isDebouncing? 'default': 'success'}
                    onChange={(e) => onChangeQuantityInput(e)} isDisabled={productStock === 0 || isLoading === 'CHECKOUT' } onBlur={onBlurQuantity}
                    value={`${quantity}`} min={1} className="w-[50px] no-arrow-input" />
                <Button size="sm" color={!isDebouncing? 'default': 'success'} isDisabled={quantity >= productStock || isLoading === 'CHECKOUT'} isIconOnly onPress={() => onPressQuantityButton(1)}><PlusIcon /></Button>
            </div>
        </div>
    )
}