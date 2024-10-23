export interface IProduct {
    id: number,
    slug: string
    name: string,
    description: string,
    price: number,
    imageUrl: string | null,
    createdAt: string,
    updatedAt: string
}