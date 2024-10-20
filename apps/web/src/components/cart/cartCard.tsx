export default function CartCard({cart}: {cart: ICart}) {

    return (
        <li className="grid grid-cols-3 bg-slate-100">
            <div className="col-span-2">
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