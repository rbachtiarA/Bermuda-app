import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import SuccessCheckmarkIcon from "../icon/SuccessCheckmarkIcon";
import { useRouter } from "next/navigation";

export default function PaymentEmpty() {
    const router = useRouter()
    const onPressToCart = () => {
        router.push('/cart')
    } 
    const onPressToProduct = () => {
        router.push('/product')
    } 
    return (
        <div className="p-2">
            <Card>
                <CardBody className="bg-foreground-200 flex justify-center items-center">
                    {/* <SuccessCheckmarkIcon size={100}/> */}
                    <h2 className="text-lg font-bold">There is no active payment</h2>
                    <p className="font-semibold">Browse our best product and create checkout</p>
                </CardBody>
                <CardFooter className="gap-2 justify-end">
                    <Button color="primary" onPress={onPressToProduct}>See another product</Button>
                    <Button color="primary" onPress={onPressToCart} variant="light">Return to Cart</Button>
                </CardFooter>
            </Card>
        </div>
    )
}