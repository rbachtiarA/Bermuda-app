import { Card, CardHeader, Skeleton } from "@nextui-org/react";

export default function SkeletonCategoryCard() {
    return (
        <Card shadow="none" className="flex-shrink-0 border-1 border-foreground-200">
            <CardHeader>
                <Skeleton className="w-[100px] h-4"/>
            </CardHeader>
        </Card>
    )
}
