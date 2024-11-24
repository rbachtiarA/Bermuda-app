export interface IDiscountAll {
  id: number;
  name: string;
  discountType: string;
  minPurchase?: number;
  productId?: number;
  storeId?: number;
  value: number;
}

export interface IDiscount {
  id?: number;
  discountType?:
    | 'FLAT'
    | 'PERCENTAGE'
    | 'BUY_ONE_GET_ONE'
    | 'REFERRAL_GIVER'
    | 'REFERRAL_USER'
    | string;
  giverId?: number;
  minPurchase?: number;
  productId?: number;
  storeId?: number;
  userId?: number;
  value: number;
}

export interface IDiscountMinPur {
  id?: number;
  discountType?:
    | 'FLAT'
    | 'PERCENTAGE'
    | 'BUY_ONE_GET_ONE'
    | 'REFERRAL_GIVER'
    | 'REFERRAL_USER'
    | string;
  minPurchase?: number;
  storeId?: number;
  value: number;
}

export interface IDiscountBogo {
  id?: number;
  discountType?: 'BUY_ONE_GET_ONE' | string;
  storeId?: number;
  productId?: number;
  value: number;
}

export interface Discount {
  id: number;
  storeId: number;
  productId: number;
  discountType: string;
  amount: number; // contoh, sesuaikan dengan schema di backend
  products: any; // ubah tipe data jika ada interface untuk products
  stores: any; // ubah tipe data jika ada interface untuk stores
  giver: any; // ubah tipe data jika ada interface untuk giver
  user: any; // ubah tipe data jika ada interface untuk user
}

export interface GetDiscountParams {
  storeId?: number;
  productId?: number;
  discountType?: string;
}
