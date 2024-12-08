'use client'
import { getCheckoutItems } from "@/lib/cart"
import currencyRupiah from "@/lib/rupiahCurrency"
import { useAppSelector } from "@/redux/hook"
import { ICartItem } from "@/type/cart"
import { Card, CardBody, CardHeader, Image, Skeleton } from "@nextui-org/react"
import { useEffect, useMemo, useState } from "react"
import SkeletonCheckoutItemCard from "@/components/skeleton/skeletonCheckoutItemCard"

export default function CheckoutList({ updateItemTotalPayment }: { updateItemTotalPayment: (totalPayment: number) => void }) {
    const store = useAppSelector(state => state.store)
    const [checkoutItems, setCheckoutItems] = useState<ICartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const productStockNotReady = useMemo(() => {
        const stocks = checkoutItems.map((item) => item.product?.stock)
        const stocksInStore = stocks.map((stock) => stock?.find((item) => item.storeId === store.id))
        const productNotReady = checkoutItems.filter((item) => {
            const productStock = stocksInStore.find((stock) => item.productId === stock?.productId)
            if(productStock) {
                return item.quantity > productStock.quantity
            } 
            return true
        })
        const rslt = productNotReady.map((item) => item.productId) 
        return rslt
    }, [store.id])
    const getData = async () => {
        setIsLoading(true)
        const data:  ICartItem[] = await getCheckoutItems()
        
        setCheckoutItems([...data])
        const total = data.reduce((total, item) => total+item.quantity*item.product?.price! ,0)
        updateItemTotalPayment(total)
        setIsLoading(false)        
    }

    useEffect(() => {
        getData()        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            {
                isLoading? 
                <SkeletonCheckoutItemCard />
                :    
                <Card>
                    <CardHeader className="font-semibold">
                        <h2>{`Item(s) checkout`}</h2>
                    </CardHeader>
                    <CardBody className="grid grid-rows-[auto] gap-2">

                        {checkoutItems.map((item) => (
                            <div key={item.id} className={`flex gap-2 items-center w-full ${productStockNotReady.includes(item.productId)? 'text-danger': ''}`}>
                                {/* <Skeleton className="w-[80px] h-[80px] rounded-lg" /> */}
                                <Image src={item.product?.imageUrl || `/default-product-image.png`} 
                                className="w-[80px] h-[80px] rounded-lg" />
                                <div className={`flex flex-col justify-evenly md:h-full w-full`}>
                                    <p>{item.product?.name}</p>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">{item.quantity}<span>&nbsp;x&nbsp;</span>{currencyRupiah(item.product?.price!)}</p>
                                        <p className="hidden md:block font-semibold">{currencyRupiah(item.product?.price!*item.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            }
        </>
    )
}