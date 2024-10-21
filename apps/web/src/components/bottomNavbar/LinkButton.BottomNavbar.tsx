'use client'
import Image from "next/image";
import Link from "next/link";

export default function LinkButtonBottomNavbar({href,label, imgsrc, imgalt, component}: { href: string,label:string, imgsrc: string, imgalt: string, component?: React.ReactNode}) {
    return (
        <button onClick={() => console.log('hello')} className="flex flex-col w-full items-center justify-center active:bg-slate-400">
            <Link href={href}>
                <div className="flex relative justify-center">
                    <Image src={imgsrc} alt={imgalt} width={0} height={0} style={{width: '28px', height: 'auto'}} />
                    {component}
                    {/* <span className="absolute top-0 -right-3 bg-red-600 rounded-full text-white text-[.7em] text-center px-1">{cart.length}</span> */}
                </div>
                <p className="text-sm">{label}</p>
            </Link>
        </button>
    )
}