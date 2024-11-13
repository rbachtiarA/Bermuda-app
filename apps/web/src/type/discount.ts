export interface IDiscount {
    id:number
    createdAt: string
    discountType: 'FLAT'| 'PERCENTAGE' | 'BUY_ONE_GET_ONE' | 'REFERRAL_GIVER' | 'REFERRAL_USER'
    giverId?:number
    minPurchase?:number
    productId?:number
    storeId?:number
    updatedAt:string
    userId?:number
    value:number
}