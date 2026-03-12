import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

export default function RemoveAddressModal({
  isRemoving,
  onClose,
  handleRemove,
}: {
  isRemoving: boolean;
  handleRemove: () => Promise<void>;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isRemoving} onOpenChange={onClose} size="lg" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Konfirmasi Hapus</ModalHeader>
            <ModalBody>
              <p>
                Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={onClose}>
                Batal
              </Button>
              <Button color="primary" variant="ghost" onClick={handleRemove}>
                Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
