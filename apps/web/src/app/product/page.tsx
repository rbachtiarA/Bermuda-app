import ProductCard from "@/components/product/productCard"

export default function page() {
        
    const productList: IProduct[] = [
        {id: 1, name: 'Apple', price: 5000},
        {id: 2, name: 'Banana', price: 7000},
        {id: 3, name: 'Carrot', price: 4000},
        {id: 4, name: 'Durian', price: 20000},
        {id: 5, name: 'Eggplant', price: 10000},
    ]

    const onClickedAddToCart = () => {

    }
    return (
        <div>
            <ul className="flex flex-col gap-2">
                {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ul>
        </div>
    )
}