'use client'
import { postCartItems } from "@/lib/cart"
import currencyRupiah from "@/lib/rupiahCurrency"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { addedToCart } from "@/redux/slice/cartSlice"
import { IProduct, IStocks } from "@/type/product"
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Skeleton } from "@nextui-org/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function ProductNavCard({product}:{product: IProduct}) {
    
    const router = useRouter()
    const onClick = () => {
        router.push(`product/${product.slug}`)
    }
    return (
        <div>
            <Card isPressable shadow='sm' className="hidden md:block w-[150px]" onPress={onClick}>
                <CardHeader className="justify-center w-full">
                    {/* <Skeleton className="w-[150px] h-[150px] rounded-md"/> */}
                    <Image
                        src={product.imageUrl || `${process.env.NEXT_PUBLIC_BASE_API_URL}public/product/default-product-image.png`}
                    />
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col w-full justify-between h-full">
                        <h2>{product.name}</h2>
                        <h3 className="text-primary font-bold">{currencyRupiah(product.price)}</h3>
                    </div>
                </CardBody>
            </Card>
            <div className="md:hidden">
                <Link href={`product/${product.slug}`}>
                    <p>{product.name}</p>
                </Link>
            </div>
        </div>
    )
    
}