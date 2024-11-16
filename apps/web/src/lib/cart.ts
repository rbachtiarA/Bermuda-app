//all userId should be change to JWT TOKEN if already implemented

import { ICartItem } from "@/type/cart"
import { getToken } from "./server"


export const getAllCartItems = async (userId: number, storeId:number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/store/${storeId}`, {
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        },
        next: {revalidate: 1}})
    const { status, data } = await res.json()
    
    return data
}

//already add token
export const postCartItems = async (userId:number , productId:number, quantity:number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart`, {
        method:'POST',
        body: JSON.stringify({userId, productId, quantity}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    console.log(res)
    const { cartItem }: {cartItem: ICartItem} = await res.json()
        
    return { ok: res.ok, cartItem }
}

export const updateCartItem = async (productId:number, quantity:number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart`, {
        method:'PUT',
        body: JSON.stringify({productId, quantity}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
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

export const postCheckoutItems = async (selectedIds: number[]) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/checkout`, {
        method:'POST',
        body: JSON.stringify({selectedIds}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await res.json()
    return { ok: res.ok, data }
}

export const getCheckoutItems = async (userId: number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cart/checkout`, { 
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        },
        next: { revalidate: 1 } })
    const { status, data } = await res.json()
    console.log(res);
    
    return data.CartItem
}
