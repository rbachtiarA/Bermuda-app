'use client'
import { postCartItems } from "@/lib/cart"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { addedToCart } from "@/redux/slice/cartSlice"
import { IStocks } from "@/type/product"

export default function ProductCard({stock}:{stock: IStocks}) {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const product = stock.product
    
    const onClickedAddToCart = async (quantity: number) => {
        // dispatch(addedToCart({id: 1, productId: product.id, quantity: 1, totalPrice: product.price}))
        const res = await postCartItems(user.id, product.id, quantity)        
        res.cartItem.quantity = quantity
        dispatch(addedToCart(res.cartItem))
    }

    return (
        <li className="grid grid-cols-3 bg-slate-100">
            <div className="col-span-2">
                <p>product id: {product.id}</p>
                <p>product name: {product.name}</p>
                <p>product price: {product.price}</p>
            </div>
            <button className="bg-green-200 p-2" onClick={() => onClickedAddToCart(1)}>
                Add to Cart    
            </button>       
        </li>
    )
    
}