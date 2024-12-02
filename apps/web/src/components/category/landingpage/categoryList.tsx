'use client'
import { getCategories } from "@/lib/category.handler"
import CategoryCard from "./categoryCard"
import { useEffect, useState } from "react"

export default function CategoryList() {
    const [category, setCategory] = useState<{name: string, id:number}[]>([])
    useEffect(() => {
        const getData = async () => {
            const categoryData = await getCategories()
            const data: {name: string, id:number}[] = categoryData.result.allCategory
            setCategory(data)
        }
        getData()
    },[])
    return (
        <div className="flex overflow-auto gap-2 p-1">
            {category.length !== 0 && category.map((item) => <CategoryCard id={item.id} name={item.name} key={item.name}/>)}
        </div>
    )
}
