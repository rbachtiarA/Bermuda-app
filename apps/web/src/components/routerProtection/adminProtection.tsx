import { checkAdmin } from "@/lib/admin.handler"
import { getToken } from "@/lib/server"

export default async function AdminProtection({children}: {children: React.ReactNode}) {
    const isAdmin = await checkAdmin()
    return (
        <div>
            {
                isAdmin.status === 'ok' && 
                children
            }
            {
                isAdmin.status !== 'ok' &&  
                <p>YOU DONT HAVE AUTHORIZED ON THIS PAGE</p> 
            }
        </div>
    )
}
