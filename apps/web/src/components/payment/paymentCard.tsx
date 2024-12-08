'use client'
import { cancelOrder, getOrderPendingPayment } from "@/lib/order.handler"
import { IOrder } from "@/type/order"
import { Spinner } from "@nextui-org/react"
import { useEffect, useState } from "react"
import PaymentSuccess from "./paymentSuccess"
import PaymentCancel from "./paymentCancel"
import PaymentEmpty from "./paymentEmpty"
import PaymentCardDetails from "./paymentCardDetails"

export default function PaymentCard() {
    const [data, setData] = useState<IOrder | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    const getData = async () => {
        setIsLoading(true)
        const orderPending: IOrder = await getOrderPendingPayment() 
        setData(orderPending)
        setIsLoading(false)
    }
    
    const onClickCancelOrder = async () => {
        setIsLoading(true)
        const { msg } = await cancelOrder(data?.id!)
        if(msg === 'FOUND') {
            setData({...data!, status:"Cancelled"})
        }
        setIsLoading(false)
        return msg
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="h-full">
            {
                isLoading? 
                    <Spinner className="w-full" label="Fetching data..." />
                :
                <>
                {
                    !data && 
                    <PaymentEmpty />
                }
                {
                    (data?.status === 'PendingPayment' || data?.status === 'Waiting') &&
                    <PaymentCardDetails data={data} isLoading={isLoading} onClickCancelOrder={onClickCancelOrder} setData={setData}/>
                }
                {
                    data?.status === "Proccessed" &&
                    <PaymentSuccess data={data}/>
                }
                {
                    data?.status === "Cancelled" &&
                    <PaymentCancel data={data}/>
                }
                </>
            }
        </div>
    )
}