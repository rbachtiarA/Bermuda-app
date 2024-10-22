import { ICartItem } from "@/type/cart";
import { Checkbox } from "@nextui-org/react"
export default function CartCard({cart}: {cart: ICartItem}) {

    return (
        <li className="grid grid-cols-6 bg-slate-100">
            <div>
                <Checkbox>Hello</Checkbox>
            </div>
            <div className="col-span-4">
                <p>Cart id: {cart.id}</p>
                <p>product id: {cart.productId}</p>
                <p>product quantity: {cart.quantity}</p>
                <p>product totalPrice: {cart.totalPrice*cart.quantity}</p>
            </div>
            <button className="bg-red-200 p-2">
                remove from Cart    
            </button>       
        </li>
    )
    
}