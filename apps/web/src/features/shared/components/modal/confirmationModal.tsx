import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

export default function ConfirmationModal({isOpen, title, content,onOpenChange, onConfirm}: {isOpen: boolean, onOpenChange: () => void, title: string, content?: string, onConfirm: () => void}) {

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
            <ModalContent>

            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2>{title}</h2>
                    </ModalHeader>
                        <ModalBody>
                        <p>{content}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                            No
                            </Button>
                            <Button color="primary" onPress={() => {
                                onConfirm();
                                onClose()
                            }}>
                            Yes
                            </Button>
                        </ModalFooter>
                </>
            )}
            </ModalContent>
    </Modal>
    )
}