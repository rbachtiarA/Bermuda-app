import TitleBreadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import UserProtection from "@/components/routerProtection/userProtection";

export default function layout({children}:{children: React.ReactNode}) {

    return (
        <section>
            <UserProtection>
                <TitleBreadcrumbs title="user" className="px-2"/>
                {children}
            </UserProtection>
        </section>
    )
}