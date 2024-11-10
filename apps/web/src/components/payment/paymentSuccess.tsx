'use client'
import { IOrder } from "@/type/order";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import SuccessCheckmarkIcon from "../icon/SuccessCheckmarkIcon";
import { useRouter } from "next/navigation";

export default function PaymentSuccess({data}: {data:IOrder}) {
    const router = useRouter()
    const onPressToCart = () => {
        router.push('/cart')
    } 
    const onPressToProduct = () => {
        router.push('/product')
    } 
    return (
        <div className="p-2">
            <Card className="z-0">
                <CardBody className="bg-success-200 flex justify-center items-center">
                    <SuccessCheckmarkIcon size={100}/>
                    <h2 className="text-lg font-bold">Your payment has been confirmed</h2>
                    <p className="font-semibold">Sit tight we will prepare to shipped your goods</p>
                </CardBody>
                <CardFooter className="gap-2 justify-end">
                    <Button color="primary" onPress={onPressToCart} variant="light">Return to Cart</Button>
                    <Button color="primary" onPress={onPressToProduct}>See another product</Button>
                </CardFooter>
            </Card>
        </div>
    )
}