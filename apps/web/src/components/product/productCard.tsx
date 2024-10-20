'use client'
import { useAppDispatch } from "@/redux/hook"
import { addedToCart } from "@/redux/slice/cartSlice"

export default function ProductCard({product}: {product: IProduct}) {
    const dispatch = useAppDispatch()
    const onClickedAddToCart = () => {
        dispatch(addedToCart({id: 1, productId: product.id, quantity: 1, totalPrice: product.price}))
    }

    return (
        <li className="grid grid-cols-3 bg-slate-100">
            <div className="col-span-2">
                <p>product id: {product.id}</p>
                <p>product name: {product.name}</p>
                <p>product price: {product.price}</p>
            </div>
            <button className="bg-green-200 p-2" onClick={onClickedAddToCart}>
                Add to Cart    
            </button>       
        </li>
    )
    
}