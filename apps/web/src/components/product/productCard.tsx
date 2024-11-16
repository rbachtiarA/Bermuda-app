'use client'
import { postCartItems } from "@/lib/cart"
import currencyRupiah from "@/lib/rupiahCurrency"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { addedToCart } from "@/redux/slice/cartSlice"
import { IStocks } from "@/type/product"
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Skeleton } from "@nextui-org/react"
import { toast } from "react-toastify"

export default function ProductCard({stock}:{stock: IStocks}) {
    const dispatch = useAppDispatch()
    const cart = useAppSelector(state => state.cart)
    const user = useAppSelector(state => state.user)
    const product = stock.product
    
    const onClickedAddToCart = async (quantity: number) => {
        // dispatch(addedToCart({id: 1, productId: product.id, quantity: 1, totalPrice: product.price}))
        const existProduct = cart.find((item) => item.productId === product.id)
        if(existProduct) {
            if(existProduct.quantity >= stock.quantity) {
                toast.error(`Stok barang ini ${stock.quantity}, dalam keranjang mu sudah ada ${existProduct.quantity}`)
                return;
            }
        }
        const res = await postCartItems(user.id, product.id, quantity)        
        res.cartItem.quantity = quantity
        dispatch(addedToCart(res.cartItem))
        toast.success(`Berhasil memasukkan ke keranjang`)
    }

    return (
        <div>
            <Card isPressable shadow='sm' className="border-none w-full rounded-b-none">
                <CardHeader className="justify-center w-full">
                    {/* <Skeleton className="w-[150px] h-[150px] rounded-md"/> */}
                    <Image 
                        isZoomed
                        src={`${process.env.NEXT_PUBLIC_BASE_API_URL}public/product/product-chitato-bbq.jpg`}
                    />
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col w-full justify-between h-full">
                        <h2>{product.name}</h2>
                        <h3 className="text-primary font-bold">{currencyRupiah(product.price)}</h3>
                        <div className="w-full font-semibold text-[12px ]">
                            <p>Stock: {stock.quantity} item</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Card shadow="sm" className="rounded-t-none">
                <CardBody>
                    <Button fullWidth color="primary" variant="bordered" onPress={() => onClickedAddToCart(1)} isDisabled={stock.quantity === 0}>
                        {stock.quantity !== 0 ? `+ Add to Cart`: 'Sold Out'}    
                    </Button>
                </CardBody>
            </Card>
        </div>
    )
    
}