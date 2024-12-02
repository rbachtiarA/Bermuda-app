import ProductList from "@/components/product/productList"

export default function page() {

    return (
        <section className="grid md:grid-cols-[1fr_8fr_1fr] lg:grid-cols-[1fr_6fr_1fr] my-4 mx-1">
            <div className="md:col-start-2">
                <ProductList />
            </div>
        </section>
    )
}