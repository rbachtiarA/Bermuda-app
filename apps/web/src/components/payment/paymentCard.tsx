'use client'
import { getOrderPendingPayment } from "@/lib/order"
import { useAppSelector } from "@/redux/hook"
import { IOrder } from "@/type/order"
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import { useEffect, useState } from "react"
import PaymentDetails from "./paymentDetails/paymentDetails"
import PaymentItems from "./paymentDetails/paymentItems"
import PaymentUploadProof from "./paymentDetails/paymentUploadProof"
import PaymentRedirectMidtrans from "./paymentDetails/paymentRedirectMidtrans"

export default function PaymentCard() {
    const user = useAppSelector(state => state.user)
    const [data, setData] = useState<IOrder | null>(null)

    const getData = async () => {
        const orderPending: IOrder = await getOrderPendingPayment(user.id) 
        setData(orderPending)
    }
    
    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
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
                </CardBody>
                <CardFooter>
                    {
                        (data.status === "PendingPayment" || data.status === "PendingConfirmed") && 
                        <div className="w-full">
                            {(data.Payment.paymentMethod === 'Transfer' && !data.paymentProofUrl) && <PaymentUploadProof />}
                            {data.Payment.token !== null && <PaymentRedirectMidtrans orderId={data.id} token={data.Payment.token} getData={getData}/>} 
                        </div>
                    }
                </CardFooter>
            </Card>
            }
        </div>
    )
}