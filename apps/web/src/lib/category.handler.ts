export const getCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}categories`, {
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