import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export default function PaymentProofModal({isOpen, title, imgLink ,onOpenChange}: {isOpen: boolean, onOpenChange: () => void, title: string, imgLink: string}) {

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
            <ModalContent className="w-[300px] md:w-full">

            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2>{title}</h2>
                    </ModalHeader>
                        <ModalBody className="">
                            <Image
                                src={`${imgLink}`}
                                alt={`${title} paymentProof`}
                                width={'100%'}
                                height={'auto'}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                </>
            )}
            </ModalContent>
    </Modal>
    )
}