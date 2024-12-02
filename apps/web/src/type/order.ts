import { IAddress } from "./address"
import { IProduct } from "./product"
import { IStore } from "./store"

export interface IOrder {
    id: number,
    userId: number,
    shippingOptions?: number,
    status: 'PendingPayment'| 'Waiting' | 'Confirmed' | 'Proccessed' | 'Shipped' | 'Completed' | 'Cancelled'
    paymentProofUrl?: string,
    totalAmount: number,
    addressId: number,
    Payment: IPayment,
    orderItems: IOrderItem[],
    Address: IAddress
    createdAt: string
    shippingCost: number
    discountId?: number
    discountAmount: number
    shippedAt: string | null
    storeId: number
    Store: IStore
}
    

export interface IPayment {
    id: number,
    orderId: number,
    amountPaid: 28000,
    paymentMethod: "Transfer" | "Gateway",
    expiredDate: string,
    token: string | null,
    isConfirmed: boolean,
    confirmedAt: string
}

export interface IOrderItem {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
    discountValue: 0
    product: IProduct
}