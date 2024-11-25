'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { DeleteIcon } from '../icons/deleteIcon';
import { useState } from 'react';

interface DeleteAddressProps {
  addressId: number;
  onDeleteSuccess: () => void;
}
export default function DeleteAddress({
  addressId,
  onDeleteSuccess,
}: DeleteAddressProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}address/${addressId}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        onDeleteSuccess();
        onOpenChange();
      } else {
        console.error('Failed to delete address:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip color="danger" content="Hapus Alamat">
        <div className="text-lg  cursor-pointer active:opacity-50">
          <DeleteIcon onClick={onOpen} />
        </div>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={!isLoading}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Konfirmasi Hapus</ModalHeader>
              <ModalBody>
                <p>
                  Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini
                  tidak dapat dibatalkan.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => onOpenChange()}
                >
                  Batal
                </Button>
                <Button
                  color="primary" variant='ghost'
                  onClick={handleDelete}
                  isLoading={isLoading}
                >
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
