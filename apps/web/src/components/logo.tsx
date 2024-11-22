import Image from "next/image";

export default function SiteLogo () {
    return (
        <Image src='/logo.png' alt="logo" height={45} width={45} className="pr-2" />
        
    )
}