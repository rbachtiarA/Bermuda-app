export interface IProduct {
    id: number,
    slug: string
    name: string,
    description: string,
    price: number,
    stock?: IStocks[]
    imageUrl: string | null,
    createdAt: string,
    updatedAt: string
}

export interface IStocks {
    id: number,
    quantity: number,
    storeId: number,
    productId: number,
    product: IProduct
}