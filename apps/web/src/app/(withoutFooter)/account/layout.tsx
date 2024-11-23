import TitleBreadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import BreadcrumbsAccount from "@/components/breadcrumbs/breadcrumbsAccount";
import UserProtection from "@/components/routerProtection/userProtection";
import SideBar from "@/components/sidebar/sideBar";

export default function layout({children}:{children: React.ReactNode}) {

    return (
        <section className="">
            <UserProtection>
                <div className="md:block hidden">
                    <SideBar />
                </div>
                <div className="md:ml-[260px]">
                    <BreadcrumbsAccount title="user" className="px-2 md:hidden"/>
                    {children}
                </div>
            </UserProtection>
        </section>
    )
}