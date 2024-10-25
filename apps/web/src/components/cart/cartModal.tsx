import { ICartItem } from "@/type/cart";
import { IProduct } from "@/type/product";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton } from "@nextui-org/react";

export default function CartModal({isOpen, onOpenChange, product, cart}: {isOpen: boolean, onOpenChange: () => void, product: IProduct, cart: ICartItem}) {

    return (
        <Modal isOpen={isOpen} placement="bottom-center" onOpenChange={onOpenChange} isDismissable={false}>
            <ModalContent>

            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Change Details</ModalHeader>
                        <ModalBody>
                        <div className="grid grid-cols-[repeat(9,1fr)] gap-x-4 justify-center items-center">
                            <div className="col-span-3 md:col-span-1">
                                <Skeleton className="rounded-lg w-[50px] h-[50px] md:w-[150px] md:h-[150px]" />
                            </div>
                            <div className="col-span-5">
                                <p className="text-wrap">{product?.name || 'Product Name Null'}</p>
                                <p className="text-foreground-500">{product?.price || 'Product Price Null'}</p>
                            </div>
                            <div className="text-center col-span-2">
                                <p>Qty</p>
                                <p className="text-foreground-500">{cart.quantity}</p>
                            </div>
                            <div className="">
                                <p>Total Price</p>
                                <p className="font-bold">{product?.price ? product.price*cart.quantity: 0}</p>
                            </div>
                        </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                            Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                            Action
                            </Button>
                        </ModalFooter>
                </>
            )}
            </ModalContent>
    </Modal>
    )
}