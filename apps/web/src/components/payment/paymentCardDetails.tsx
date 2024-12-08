import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import PaymentCountdown from "./paymentDetails/paymentCountdown";
import PaymentDetails from "./paymentDetails/paymentDetails";
import PaymentUploadProof from "./paymentDetails/paymentUploadProof";
import PaymentRedirectMidtrans from "./paymentDetails/paymentRedirectMidtrans";
import { IOrder } from "@/type/order";
import { Dispatch, SetStateAction } from "react";

export default function PaymentCardDetails({data, isLoading, setData, onClickCancelOrder}: {data: IOrder,isLoading: boolean, setData: Dispatch<SetStateAction<IOrder | null>>, onClickCancelOrder:() => void}) {
    return (
        <Card>
                <CardHeader className="flex justify-center items-center">
                    <h2 className="font-bold text-lg">Payment Details</h2>
                </CardHeader>
                <CardBody>
                    <div>
                        <h3 className="font-semibold">Shipping Address</h3>
                        <p>{data?.Address.addressLine}</p>
                    </div>
                    <Divider className="my-1" />
                    <PaymentDetails DiscountAmount={data.discountAmount} shippingCost={data.shippingCost} items={data.orderItems} orderId={data?.id!} status={data?.status} totalAmount={data?.totalAmount!} paymentMethod={data.Payment.paymentMethod} />

                    {
                        data.status === "PendingPayment" &&
                        <PaymentCountdown expDate={data.Payment.expiredDate} />
                    }
                </CardBody>
                <CardFooter>
                    {
                        (data.status === "PendingPayment") && 
                        <div className="w-full">
                            {(data.Payment.paymentMethod === 'Transfer' && !data.paymentProofUrl) && <PaymentUploadProof isLoading={isLoading} data={data} setData={setData} onClickCancelOrder={onClickCancelOrder}/>}
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
    )
}
