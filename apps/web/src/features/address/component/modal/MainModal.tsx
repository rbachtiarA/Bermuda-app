import { IAddressList } from '@/type/address';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import React from 'react';
import AddressCard from '../addressCard';
import useModalAddress from '../../hooks/useModal';
import FormModal from './FormModal';
import RemoveAddressModal from './RemoveModal';

interface Props {
  data: Record<string, IAddressList>;
  isOpen: boolean;
  onOpen: (val: boolean) => void;
}

export default function MainModal({ isOpen, onOpen, data }: Props) {
  const {
    modal,
    selectedAddress,
    onClose,
    onCreate,
    onEdit,
    onRemove,
    handleRemove,
  } = useModalAddress();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="lg"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mau di kirim kemana?
              </ModalHeader>
              <ModalBody className="h-full">
                {Object.keys(data).length > 0 &&
                  Object.keys(data).map((addressId) => (
                    <AddressCard
                      key={addressId}
                      address={data[addressId]}
                      onClose={onClose}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />
                  ))}
                {Object.keys(data).length === 0 && (
                  <p>Tidak ada alamat terdaftar, silahkan buat alamat baru</p>
                )}
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button fullWidth color="primary" onClick={onCreate}>
                  Buat Alamat Baru
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <FormModal
        isCreating={modal === 'add'}
        isEdit={modal === 'edit'}
        onClose={onClose}
        selectedAddress={selectedAddress}
      />

      <RemoveAddressModal
        handleRemove={handleRemove}
        isRemoving={modal === 'remove'}
        onClose={onClose}
      />
    </>
  );
}
