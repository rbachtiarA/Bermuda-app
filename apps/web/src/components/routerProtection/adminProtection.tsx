import { checkAdmin } from "@/lib/admin.handler"
import { redirect } from "next/navigation"

export default async function AdminProtection({children}: {children: React.ReactNode}) {
    const isAdmin = await checkAdmin()
    if(isAdmin.status !== 'ok') redirect('/')
    return (
        <>
            {children}
        </>
    )
}
