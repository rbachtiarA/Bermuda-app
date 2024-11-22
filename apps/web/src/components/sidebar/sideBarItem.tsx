import Link from "next/link";

export default function SidebarItem({link, label, isActive}: {link: string, isActive: boolean, label: string}) {

    return (
        <li className="py-4">
            <Link
            href={link}
            className={`text-gray-700 relative text-nowrap ${isActive? 'font-semibold underline' : 'no-underline'}`}
            >
            {label}
            </Link>
        </li>
    )
}