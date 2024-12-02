import { IDiscount } from "@/type/discount";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import DiscountCard from "../discount/discountCard";

export default function DiscountSelectionModal({dataDiscount, isOpen, itemTotalPayment, onOpenChange, onSelectDiscount}: {itemTotalPayment:number,dataDiscount:IDiscount[],isOpen: boolean,onSelectDiscount:(discount:IDiscount|null) => void, onOpenChange: () => void}) {

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
            <ModalContent className="w-[300px] md:w-full">

            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2>Discount / Voucher</h2>
                    </ModalHeader>
                        <ModalBody className="">
                            {dataDiscount.map((discount) => (
                                <DiscountCard key={discount.id} itemTotalPayment={itemTotalPayment} onSelect={onSelectDiscount} discount={discount} onClose={onClose} />
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button color='danger' variant="light" onPress={() => {
                                onSelectDiscount(null)
                                onClose()
                            }}>
                                <p className="text-sm">Remove discount</p>
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                </>
            )}
            </ModalContent>
    </Modal>
    )
}