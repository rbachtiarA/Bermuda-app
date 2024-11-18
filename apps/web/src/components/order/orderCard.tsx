import currencyRupiah from "@/lib/rupiahCurrency";
import { IOrder } from "@/type/order";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
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
                        <div key={item.id} className="flex justify-between">
                            <p>{item.product.name}</p>
                            <p>{item.quantity} x {currencyRupiah(item.price)}</p>
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
                    <div>
                        <p>Address:</p>
                        <p>{order.Address.addressLine}</p>
                    </div>
                </CardBody>

            </Card>

            <Card className="rounded-none md:rounded-md">
                <CardHeader className="font-bold text-lg">
                    <h2>Payments Details</h2>
                </CardHeader>
                <Divider />
                <CardBody className="list-none">
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