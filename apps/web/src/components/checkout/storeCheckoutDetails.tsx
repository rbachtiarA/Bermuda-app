import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function StoreCheckoutDetails({storeName}: {storeName:string}) {

    return (
        <Card>
            <CardHeader>
                <h2 className="font-bold">Store origins</h2>
            </CardHeader>
            <CardBody>
                <p>Store name: {storeName}</p>
            </CardBody>
        </Card>
    )
}