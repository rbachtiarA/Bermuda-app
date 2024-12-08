'use client'
import { getCategories } from "@/lib/category.handler"
import CategoryCard from "./categoryCard"
import { useEffect, useState } from "react"
import SkeletonCategoriesList from "@/components/skeleton/skeletonCategoriesList"

export default function CategoryList() {
    const [category, setCategory] = useState<{name: string, id:number}[]>([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            const categoryData = await getCategories()
            const data: {name: string, id:number}[] = categoryData.result.allCategory
            setCategory(data)
            setIsLoading(false)
        }
        getData()
    },[])
    return (
        <>
        {
            isLoading? 
            <SkeletonCategoriesList /> :
            <div className="flex overflow-auto gap-2 p-1">
                {category.length !== 0 && category.map((item) => <CategoryCard id={item.id} name={item.name} key={item.name}/>)}
            </div>

        }
        </>
    )
}
