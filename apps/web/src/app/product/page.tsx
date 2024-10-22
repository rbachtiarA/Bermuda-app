import ProductCard from "@/components/product/productCard"
import ProductList from "@/components/product/productList"
import { IProduct } from "@/type/product"

export default function page() {
    
    const productList: IProduct[] = [
        {id: 1, name: 'Apple', price: 5000},
        {id: 2, name: 'Banana', price: 7000},
        {id: 3, name: 'Carrot', price: 4000},
        {id: 4, name: 'Durian', price: 20000},
        {id: 5, name: 'Eggplant', price: 10000},
    ]

    return (
        <section>
            <ProductList />
        </section>
    )
}