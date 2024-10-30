import Image from "next/image";
import Link from "next/link";

export default function SiteLogo () {
    return (
        <Link href={'/'}><Image src='/logo.png' alt="logo" height={35} width={89} className="pr-2" /></Link>
        
    )
}