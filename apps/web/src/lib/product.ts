export const getProductsData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}product`, {next: {revalidate: 1}})
    const { status, data } = await res.json()
    
    return data
}