import UserProtection from "@/components/routerProtection/userProtection";

export default function layout({children}:{children: React.ReactNode}) {

    return (
        <UserProtection>
            {children}
        </UserProtection>
    )
}