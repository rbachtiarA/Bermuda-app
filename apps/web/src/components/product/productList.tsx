
import { IStocks } from "@/type/product"
import ProductCard from "./productCard"
import { getProductsData } from "@/lib/product"

export default async function ProductList() {
    // remove store id if geolocation is implemented
    const stocksList:IStocks[] = await getProductsData(1)
    
    return (
        <ul className="flex flex-col gap-2">
            {stocksList.map((stock) => (
                <ProductCard key={stock.id} stock={stock} />
            ))}
        </ul>
    )
}