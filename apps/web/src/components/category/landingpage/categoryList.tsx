import { getCategories } from "@/lib/category.handler"
import CategoryCard from "./categoryCard"

export default async function CategoryList() {
    const categoryData = await getCategories()
    const data: {name: string, id:number}[] = categoryData.result.allCategory
    
    return (
        <div className="flex overflow-auto gap-2 p-1">
            {data.map((item) => <CategoryCard id={item.id} name={item.name} key={item.name}/>)}
        </div>
    )
}
