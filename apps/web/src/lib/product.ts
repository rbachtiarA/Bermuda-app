export const getProductsData = async (storeId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}store/stocks/${storeId}`, {next: {revalidate: 1}})
    const { status, stock } = await res.json()
    
    return stock
}