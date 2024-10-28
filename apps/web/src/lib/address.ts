export const getUserAddressess = async (userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}users/userAddress/${userId}`, {next: {revalidate: 1}})
    const { status, data } = await res.json()

    return data
} 