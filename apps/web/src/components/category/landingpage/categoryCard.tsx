import { Card, CardHeader } from "@nextui-org/react";

export default function CategoryCard({id, name}: {name: string, id: number}) {
    return (
        <Card isPressable isHoverable shadow="none" className="flex-shrink-0 border-1 border-foreground-200">
            <CardHeader>
                <h2>{name}</h2>
            </CardHeader>
        </Card>
    )
}
