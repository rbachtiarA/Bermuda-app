import TitleBreadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import UserProtection from "@/components/routerProtection/userProtection";
import SideBar from "@/components/sideBar";

export default function layout({children}:{children: React.ReactNode}) {

    return (
        <section>
            <UserProtection>
                <div className="md:block hidden">
                    <SideBar />
                </div>
                <div className="md:ml-[260px]">
                    <TitleBreadcrumbs title="user" className="px-2 md:hidden"/>
                    {children}
                </div>
            </UserProtection>
        </section>
    )
}