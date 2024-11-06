import { IAddress } from "./address"
import { IProduct } from "./product"

export interface IOrder {
    id: number,
    userId: number,
    shippingOptions: number,
    status: 'PendingPayment'| 'Waiting' | 'Confirmed' | 'Proccessed' | 'Shipped' | 'Completed' | 'Cancelled'
    paymentProofUrl: string,
    totalAmount: number,
    addressId: number,
    Payment: IPayment,
    orderItems: IOrderItem[],
    Address: IAddress
    createdAt: string
}
    

export interface IPayment {
    id: number,
    orderId: number,
    amountPaid: 28000,
    paymentMethod: "Transfer" | "Gateway",
    expiredDate: string,
    token: string | null,
    isConfirmed: boolean,
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