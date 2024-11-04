'use client'
import { cancelOrder, getOrderPendingPayment } from "@/lib/order"
import { useAppSelector } from "@/redux/hook"
import { IOrder } from "@/type/order"
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import { useEffect, useState } from "react"
import PaymentDetails from "./paymentDetails/paymentDetails"
import PaymentItems from "./paymentDetails/paymentItems"
import PaymentUploadProof from "./paymentDetails/paymentUploadProof"
import PaymentRedirectMidtrans from "./paymentDetails/paymentRedirectMidtrans"
import PaymentCountdown from "./paymentDetails/paymentCountdown"

export default function PaymentCard() {
    const user = useAppSelector(state => state.user)
    const [data, setData] = useState<IOrder | null>(null)
    
    const getData = async () => {
        const orderPending: IOrder = await getOrderPendingPayment(user.id) 
        setData(orderPending)
    }
    
    const onClickCancelOrder = async () => {
        const status = await cancelOrder(data?.id!)
        console.log(status);
        getData()
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            {!data && <h2>There is no active payment right now, you can checkout item on your cart</h2>}
            {data &&
            <Card>
                <CardHeader className="flex justify-center items-center">
                    <h2 className="font-bold text-lg">Payment Details</h2>
                </CardHeader>
                <CardBody>
                    <div>
                        <h3>Shipping Address</h3>
                        <p>{data?.Address.addressLine}, {data?.Address.city}, {data?.Address.state}, {data?.Address.postalCode}</p>
                    </div>
                    <PaymentDetails orderId={data?.id!} status={data?.status} totalAmount={data?.totalAmount!} paymentMethod={data.Payment.paymentMethod} />
                    <PaymentItems items={data?.orderItems!}/>
                    <PaymentCountdown expDate={data.Payment.expiredDate} />
                </CardBody>
                <CardFooter>
                    {
                        (data.status === "PendingPayment" || data.status === "PendingConfirmed") && 
                        <div className="w-full">
                            {(data.Payment.paymentMethod === 'Transfer' && !data.paymentProofUrl) && <PaymentUploadProof onClickCancelOrder={onClickCancelOrder}/>}
                            {data.Payment.token !== null && <PaymentRedirectMidtrans orderId={data.id} token={data.Payment.token} getData={getData} onClickCancelOrder={onClickCancelOrder}/>} 
                        </div>
                    }
                </CardFooter>
            </Card>
            }
        </div>
    )
}