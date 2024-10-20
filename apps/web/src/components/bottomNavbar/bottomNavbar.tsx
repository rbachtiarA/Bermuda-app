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
        <div className="w-full fixed bottom-0" style={roboto.style}>
            <ul className="grid grid-cols-3 divide-x divide-white text-center py-1 bg-slate-200 justify-center items-center">
                <li>
                    <LinkButtonBottomNavbar label='Profile' href="/user" imgsrc="/icon-user-profile.svg" imgalt="user" />
                </li>
                <li>
                    <LinkButtonBottomNavbar label='Order' href="/order" imgsrc="/icon-order.svg" imgalt="order" />
                </li>
                <li>
                    <LinkButtonBottomNavbar label='Cart' href="/cart" imgsrc="/icon-shopping-cart.svg" imgalt="cart" component={<NotificationBottomNavbar data={cart}/>}/>
                </li>
            </ul>
        </div>
    )
}