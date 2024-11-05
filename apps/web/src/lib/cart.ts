//all userId should be change to JWT TOKEN if already implemented

import { ICartItem } from "@/type/cart"

export const getAllCartItems = async (userId: number, storeId:number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/${userId}/store/${storeId}`, {next: {revalidate: 1}})
    const { status, data } = await res.json()
    
    return data
}

export const postCartItems = async (userId:number , productId:number, quantity:number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart`, {
        method:'POST',
        body: JSON.stringify({userId, productId, quantity}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const { cartItem }: {cartItem: ICartItem} = await res.json()
        
    return { ok: res.ok, cartItem }
}

export const updateCartItem = async (userId:number , productId:number, quantity:number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart`, {
        method:'PUT',
        body: JSON.stringify({userId, productId, quantity}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const data = await res.json()
    return { ok: res.ok, data }
}

export const deleteCartItem = async (cartItemId:number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/remove/${cartItemId}`, {
        method:'DELETE'
    })

    const data = await res.json()
    return { ok: res.ok, data }
}

export const postCheckoutItems = async (userId:number, selectedIds: number[]) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/checkout`, {
        method:'POST',
        body: JSON.stringify({userId, selectedIds}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const data = await res.json()
    return { ok: res.ok, data }
}

export const getCheckoutItems = async (userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/checkout/${userId}`, { next: { revalidate: 1 } })
    const { status, data } = await res.json()
    console.log(res);
    
    return data.CartItem
}
