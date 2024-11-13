'use client'
import { cancelOrder, getOrderPendingPayment } from "@/lib/order.handler"
import { useAppSelector } from "@/redux/hook"
import { IOrder } from "@/type/order"
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import { useEffect, useState } from "react"
import PaymentDetails from "./paymentDetails/paymentDetails"
import PaymentItems from "./paymentDetails/paymentItems"
import PaymentUploadProof from "./paymentDetails/paymentUploadProof"
import PaymentRedirectMidtrans from "./paymentDetails/paymentRedirectMidtrans"
import PaymentCountdown from "./paymentDetails/paymentCountdown"
import { ToastContainer } from "react-toastify"
import PaymentSuccess from "./paymentSuccess"
import PaymentCancel from "./paymentCancel"
import PaymentEmpty from "./paymentEmpty"

export default function PaymentCard() {
    const user = useAppSelector(state => state.user)
    const [data, setData] = useState<IOrder | null>(null)
    
    const getData = async () => {
        const orderPending: IOrder = await getOrderPendingPayment() 
        setData(orderPending)
    }
    
    const onClickCancelOrder = async () => {
        const { msg } = await cancelOrder(data?.id!)
        if(msg === 'FOUND') {
            setData({...data!, status:"Cancelled"})
        }
        return msg
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="h-full">
            {!data && <PaymentEmpty />}
            {(data?.status === 'PendingPayment' || data?.status === 'Waiting') &&
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

                    {
                        data.status === "PendingPayment" &&
                        <PaymentCountdown expDate={data.Payment.expiredDate} />
                    }
                </CardBody>
                <CardFooter>
                    {
                        (data.status === "PendingPayment") && 
                        <div className="w-full">
                            {(data.Payment.paymentMethod === 'Transfer' && !data.paymentProofUrl) && <PaymentUploadProof data={data} setData={setData} onClickCancelOrder={onClickCancelOrder}/>}
                            {data.Payment.token !== null && <PaymentRedirectMidtrans orderId={data.id} token={data.Payment.token} data={data} setData={setData} onClickCancelOrder={onClickCancelOrder}/>} 
                        </div>
                    }
                    {
                        data.status === 'Waiting' && data.paymentProofUrl &&
                        <div className="w-full">
                            <h2 className="font-semibold">Your file has been upload, and Store need to confirm your proof</h2>
                            <p>Sit tight, while waiting you can browse our other product</p>
                        </div>
                    }
                    
                </CardFooter>
            </Card>
            }
            {
                data?.status === "Proccessed" &&
                <PaymentSuccess data={data}/>
            }
            {
                data?.status === "Cancelled" &&
                <PaymentCancel data={data}/>
            }
            <ToastContainer position="top-center"/>
        </div>
    )
}