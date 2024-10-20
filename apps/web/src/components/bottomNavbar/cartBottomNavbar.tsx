'use client'
import { useAppSelector } from "@/redux/hook";
import Image from "next/image";

export default function CartBottomNavbar () {
    const cart = useAppSelector(state => state.cart)
    return (
        <button onClick={() => console.log('hello')} className="flex flex-col w-full items-center justify-center active:bg-slate-400">
            <div className="flex relative">
                <Image src={'/icon-shopping-cart.svg'} alt="Cart" width={0} height={0} style={{width: '28px', height: 'auto'}} />
                <span className="absolute top-0 -right-3 bg-red-600 rounded-full text-white text-[.7em] text-center px-1">{cart.length}</span>
            </div>
            <p className="text-sm">Cart</p>
        </button>
    )
}