
import { IProduct } from "@/type/product"
import ProductCard from "./productCard"
import { getProductsData } from "@/lib/product"

export default async function ProductList() {
    const productList:IProduct[] = await getProductsData()

    return (
        <ul className="flex flex-col gap-2">
            {productList.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </ul>
    )
}