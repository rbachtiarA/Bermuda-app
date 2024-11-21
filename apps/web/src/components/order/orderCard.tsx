import currencyRupiah from "@/lib/rupiahCurrency";
import { IOrder } from "@/type/order";
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import PaymentList from "../payment/paymentDetails/paymentList";

export default function OrderCard({order, ...props}: {order: IOrder, className?:string}) {    
    return (
        <div {...props}>
            <Card className="rounded-none md:rounded-md">
                <CardHeader className="font-bold text-lg">
                    <h2>Details Order</h2>
                </CardHeader>
                    <Divider />
                <CardBody>
                    <h2>Status Order : {order.status}</h2>
                    <p>Bought Date : {new Date(order.createdAt).toLocaleString()}</p>
                </CardBody>
            </Card>
            
            <Card className="rounded-none md:rounded-md">
                <CardHeader className="font-bold text-lg">
                    <h2>Product Details</h2>
                </CardHeader>
                    <Divider />
                <CardBody>
                    {order.orderItems.map((item) => (
                        <div key={item.id} className="flex gap-2">
                            <Image src={item.product.imageUrl || `${process.env.NEXT_PUBLIC_BASE_API_URL}public/product/default-product-image.png`} className="w-[100px] h-auto"/>
                            <div className="flex flex-col justify-around">
                                <p className="font-semibold">{item.product.name}</p>
                                <p>{item.quantity} x {currencyRupiah(item.price)}</p>
                            </div>
                        </div>
                    ))}
                </CardBody>
            </Card>

            

            <Card className="rounded-none md:rounded-md">
                <CardHeader className="font-bold text-lg">
                    <h2>Shipping Details</h2>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold">Recipient : {order.Address.recipient}</p>
                        <div>
                            <p className="font-semibold">Address:</p>
                            <p>{order.Address.addressLine}</p>
                        </div>
                    </div>
                </CardBody>

            </Card>

            <Card className="rounded-none md:rounded-md">
                <CardHeader className="font-bold text-lg">
                    <h2>Payments Details</h2>
                </CardHeader>
                <Divider />
                <CardBody className="list-none flex flex-col gap-2">
                        <PaymentList label="Method Payment :" value={order.Payment.paymentMethod} />
                        <Divider />
                        <PaymentList label="Total Item Amount:" value={currencyRupiah(order.totalAmount)}/>
                        <PaymentList label="Shipping Cost:" value={currencyRupiah(order.shippingCost)}/>
                        <PaymentList label="Discount Amount:" value={`-`+currencyRupiah(order.discountAmount)}/>
                        <Divider />
                        <PaymentList className="font-bold" label="Total Amount:" value={currencyRupiah(order.totalAmount)}/>
                </CardBody>
            </Card>
        </div>
    )
}