import { Button, Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";

export default function SkeletonProductCard() {
    return (
        <div>
            <Card
                shadow="sm"
                className="border-none w-full rounded-b-none"
            >
                <CardHeader className="justify-center w-full">
                    <Skeleton className="w-[200px] h-[200px]"/>
                </CardHeader>
                <CardBody>
                <div className="flex flex-col gap-2 w-full justify-between h-full">
                    <Skeleton className="w-full h-4" />
                    
                    <div className="w-full font-semibold text-[12px ]">
                        <Skeleton className="w-full h-4" />
                    </div>
                </div>
                </CardBody>
            </Card>
            <Card shadow="sm" className="rounded-t-none">
                <CardBody>
                <Button
                    fullWidth
                    color="primary"
                    variant="bordered"
                    isDisabled
                >
                    + Add to Cart
                </Button>
                </CardBody>
            </Card>
        </div>
  )
}
