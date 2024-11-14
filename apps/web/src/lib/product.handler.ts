export const getProducts = async (search?: string) => { 
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}product?search=${search??''}`, {next: {revalidate: 1}})
    const { status, products } = await res.json()
    
    return { status, products }
}