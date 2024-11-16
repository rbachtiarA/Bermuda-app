'use client'
import { IProduct, IStocks } from "@/type/product"
import ProductCard from "./productCard"
import { getStoreProducts } from "@/lib/store.handler"
import { useAppSelector } from "@/redux/hook"
import { useEffect, useState } from "react"

export default function ProductList() {
    const store = useAppSelector(state => state.store)
    const [data, setData] = useState<IStocks[]>([])
    // remove store id if geolocation is implemented
    const getData = async () => {
        const res = await getStoreProducts(store.id)
        if(res) {
            setData([...res])
        }
    }
    
    useEffect(()=> {
        getData()
    }, [])
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {data.map((stock) => (
                <ProductCard key={stock.id} stock={stock} />
            ))}
        </div>
    )
}