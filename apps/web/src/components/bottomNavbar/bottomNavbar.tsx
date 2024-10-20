import OrderBottomNavbar from "./orderBottomNavbar";
import CartBottomNavbar from "./cartBottomNavbar";
import UserBottomNavbar from "./userBottomNavbar";
import { Roboto } from "next/font/google";


const roboto = Roboto({
    weight: ['400'],
    subsets: ['latin']
})

export default function BottomNavbar () {    
    return (
        <div className="w-full fixed bottom-0" style={roboto.style}>
            <ul className="grid grid-cols-3 divide-x divide-white text-center py-1 bg-slate-200 justify-center items-center">
                <li>
                    <UserBottomNavbar />
                </li>
                <li>
                    <OrderBottomNavbar />
                </li>
                <li>
                    <CartBottomNavbar />
                </li>
            </ul>
        </div>
    )
}