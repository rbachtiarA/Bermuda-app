import { getToken } from "@/lib/server"
import { redirect } from "next/navigation"

export default async function UserProtection({children}: {children: React.ReactNode}) {
    const token = await getToken()
    if(!token) redirect('/login')
    return (
        <>
            {children}
        </>
        
    )
}
