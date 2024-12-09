import { Button, Input, Skeleton } from "@nextui-org/react";
import MinusIcon from "../icon/MinusIcon";
import PlusIcon from "../icon/PlusIcon";

export default function SkeleteonCartQuantityInput() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex w-full justify-end">
            <Skeleton className="w-full h-[10px]" />
        </div>
        <div className="flex gap-1 w-full justify-end">
            <Button size="sm" isDisabled isIconOnly> <MinusIcon /></Button>
            <Input size="sm" type="number" isDisabled className="w-[50px] no-arrow-input" />
            <Button size="sm" isIconOnly isDisabled><PlusIcon /></Button>
        </div>
    </div>
  )
}
