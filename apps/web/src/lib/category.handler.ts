import { ICategory } from "@/type/category";

const base_url = "http://localhost:8000/api"
export const getCategories = async () => {
    const res = await fetch(`${base_url}/categories`, {
        method: 'GET', 
        headers: {
            "Content-Type": "appliication/json"
        }, next: { revalidate: 1 }
    })

    if (!res.ok) {
        throw new Error("Faled to fetch categories")
    }
    const result = await res.json()
    return result.allCategory
}