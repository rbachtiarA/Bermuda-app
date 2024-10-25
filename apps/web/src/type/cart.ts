import { IProduct } from "./product"

export interface ICartItem {
    id: number
    cartId: number
    productId: number
    totalPrice: number
    quantity: number
    createdAt?: string,
    updatedAt?: string,
    product?: IProduct | undefined
}

export interface IUpdateQuantityCart {
    productId: number
    quantity: number
}