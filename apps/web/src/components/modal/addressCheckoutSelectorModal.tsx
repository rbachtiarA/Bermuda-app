import { IAddress } from "@/type/address";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

export default function AddressCheckoutSelectorModal({addressess, isOpen,onOpenChange, onConfirm}: {addressess: IAddress[],isOpen: boolean, onOpenChange: () => void, onConfirm: (selectedAddress: IAddress) => void}) {

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} className="overflow-auto" scrollBehavior="outside">
            <ModalContent>

            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2>Your Address</h2>
                    </ModalHeader>
                        <ModalBody>
                            {addressess.map((address) => (
                                <Card key={address.id} isPressable isHoverable onPress={() => onConfirm(address)}>
                                    <CardHeader className="font-bold">
                                        <p>{address.label}</p>
                                    </CardHeader>
                                    <CardBody>
                                        <p>recipient: {address.recipient}</p>
                                        <p>{address.addressLine}</p>
                                    </CardBody>
                                </Card>
                            ))}


                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                                close
                            </Button>
                        </ModalFooter>
                </>
            )}
            </ModalContent>
    </Modal>
    )
}