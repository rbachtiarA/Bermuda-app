'use client'
import Image from "next/image";

export default function OrderBottomNavbar () {
    return (
        <button onClick={() => console.log('hello')} className="flex flex-col w-full items-center justify-center active:bg-slate-400">
            <div className="flex relative">
                <Image src={'/icon-order.svg'} alt="order" width={0} height={0} style={{width: '28px', height: 'auto'}} />
                {/* <span className="absolute top-0 -right-3 bg-red-600 rounded-full text-white text-[.7em] text-center px-1">{cart.length}</span> */}
            </div>
            <p className="text-sm">Order</p>
        </button>
    )
}