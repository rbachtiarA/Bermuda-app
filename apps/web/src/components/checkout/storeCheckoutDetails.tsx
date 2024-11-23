import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

export default function StoreCheckoutDetails({storeName, inRange}: {storeName:string, inRange: boolean}) {

    return (
        <Card>
            <CardHeader>
                <div className="flex gap-2 justify-center items-center">
                    <h2 className="font-bold text-lg">Store origins</h2>
                    {!inRange && <Chip color="danger">Out of Range</Chip>}
                </div>
            </CardHeader>
            <CardBody>
                <p>Store name: {storeName}</p>
                {!inRange && <p className="text-danger">Looks like your address is more than 50 km from our nearest store</p>}
            </CardBody>
        </Card>
    )
}