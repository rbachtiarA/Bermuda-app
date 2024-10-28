'use client'
import { getCheckoutItems } from "@/lib/cart"
import currencyRupiah from "@/lib/rupiahCurrency"
import { useAppSelector } from "@/redux/hook"
import { ICartItem } from "@/type/cart"
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react"
import { useEffect, useMemo, useState } from "react"

export default function CheckoutList({ updateItemTotalPayment }: { updateItemTotalPayment: (totalPayment: number) => void }) {
    const user = useAppSelector(state => state.user)
    const [checkoutItems, setCheckoutItems] = useState<ICartItem[]>([])
    
    const getData = async () => {
        const data:  ICartItem[] = await getCheckoutItems(user.id)
        setCheckoutItems([...data])
        const total = data.reduce((total, item) => total+item.quantity*item.product?.price! ,0)
        updateItemTotalPayment(total)        
    }

    useEffect(() => {
        getData()        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Card>
            <CardHeader className="font-semibold">Barang Checkout</CardHeader>
            <CardBody className="grid grid-rows-[auto] gap-2">

                {checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-2">
                        <Skeleton className="w-[80px] h-[80px] rounded-lg" />
                        <div className="flex flex-col justify-evenly">
                            <p>{item.product?.name}</p>
                            <p className="font-semibold">{item.quantity}<span>&nbsp;x&nbsp;</span>{currencyRupiah(item.product?.price!)}</p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    )
}