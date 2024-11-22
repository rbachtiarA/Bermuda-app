'use client'
import { postCartItems } from "@/lib/cart"
import currencyRupiah from "@/lib/rupiahCurrency"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { addedToCart } from "@/redux/slice/cartSlice"
import { IStocks } from "@/type/product"
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Skeleton } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function ProductCard({stock}:{stock: IStocks}) {
    const dispatch = useAppDispatch()
    const cart = useAppSelector(state => state.cart)
    const user = useAppSelector(state => state.user)
    const product = stock.product
    const router = useRouter()
    
    const onClickedAddToCart = async (quantity: number) => {
        const existProduct = cart.find((item) => item.productId === product.id)
        if(existProduct) {
            if(existProduct.quantity >= stock.quantity) {
                toast.error(`Stok barang ini ${stock.quantity}, dalam keranjang mu sudah ada ${existProduct.quantity}`)
                return;
            }
        }
        const res = await postCartItems(user.id, product.id, quantity)
        if(res.status === 200) {
            res.cartItem.quantity = quantity
            dispatch(addedToCart(res.cartItem))
            toast.success(`Berhasil memasukkan ke keranjang`)
        } else if (res.status === 404) {
            router.push('/login')
        } else {
            toast.error(`Something is error`)
        }
    }

    return (
        <div>
            <Card isPressable isHoverable shadow='none' className="border-2 border-b-1 border-foreground-200 w-full rounded-b-none">
                <CardHeader className="justify-center w-full">
                    {/* <Skeleton className="w-[150px] h-[150px] rounded-md"/> */}
                    <Image 
                        isZoomed
                        src={product.imageUrl || `${process.env.NEXT_PUBLIC_BASE_API_URL}public/product/default-product-image.png`}
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
            <Card shadow="none" className="rounded-t-none border-2 border-t-1 border-foreground-200">
                <CardBody>
                    <Button fullWidth color="primary" variant="bordered" onPress={() => onClickedAddToCart(1)} isDisabled={stock.quantity === 0}>
                        {stock.quantity !== 0 ? `+ Add to Cart`: 'Sold Out'}    
                    </Button>
                </CardBody>
            </Card>
        </div>
    )
    
}