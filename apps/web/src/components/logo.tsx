import Image from "next/image";

export default function SiteLogo () {
    return (
        <Image src='/logo.png' alt="logo" height={35} width={89} className="pr-2"></Image>
    )
}