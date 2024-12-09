import { Button, Card, CardBody, Checkbox, Image, Skeleton, Tooltip } from "@nextui-org/react";
import SkeleteonCartQuantityInput from "./skeletonCartQuantityInput";

export default function SkeletonCartItemCard() {
  return (
    <Card isHoverable className="w-full">
      <CardBody>
        <div className="flex gap-4">
          <Checkbox
            size="md"
            disabled
          />
          <div className="flex w-full gap-x-2 justify-center items-center">
            <div className="">
              <Skeleton className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]" />
            </div>
            <div className="flex flex-col w-full h-full justify-between">
              <div>
                <Skeleton className="text-balance w-2/5 h-5 md:max-w-none line-clamp-2 break-words" />
                <Skeleton className="text-balance w-2/5 h-5 md:max-w-none line-clamp-2 break-words" />
              </div>
              <div className="w-full grid grid-cols-2 items-end">
                <Tooltip content="Remove item" delay={0}>
                  <Button color="danger" size="sm" isIconOnly isDisabled>
                    <Image
                      src={'/icon-trashcan.svg'}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </Tooltip>
                <SkeleteonCartQuantityInput />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
