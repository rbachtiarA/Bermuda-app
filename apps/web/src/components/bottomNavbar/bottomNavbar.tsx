'use client'
import { Roboto } from "next/font/google";
import LinkButtonBottomNavbar from "./LinkButton.BottomNavbar";
import NotificationBottomNavbar from "./notificationCart.BottomNavbar";
import { useAppSelector } from "@/redux/hook";


const roboto = Roboto({
    weight: ['400'],
    subsets: ['latin']
})

export default function BottomNavbar () {
    const cart = useAppSelector(state => state.cart)
    return (
        <div className="w-full sticky bottom-0 z-[100]" style={roboto.style}>
            <ul className="grid grid-cols-4 divide-x divide-white text-center py-1 bg-slate-200 justify-center items-center">
                <li className="w-full">
                    <LinkButtonBottomNavbar label='Profile' href="/user" imgsrc="/icon-user-profile.svg" imgalt="user" />
                </li>
                <li className="w-full">
                    <LinkButtonBottomNavbar label='Order' href="/order" imgsrc="/icon-order.svg" imgalt="order" />
                </li>
                <li className="w-full">
                    <LinkButtonBottomNavbar label='Cart' href="/cart" imgsrc="/icon-shopping-cart.svg" imgalt="cart" component={<NotificationBottomNavbar data={cart}/>}/>
                </li>
                <li className="w-full">
                    <LinkButtonBottomNavbar label='product' href="/product" imgsrc="/icon-shopping-cart.svg" imgalt="product"/>
                </li>
            </ul>
        </div>
    )
}