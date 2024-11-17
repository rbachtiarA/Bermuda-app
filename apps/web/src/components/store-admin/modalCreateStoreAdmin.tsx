import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { MailIcon } from '../icons/mailIcon';
import { LockIcon } from '../icons/lockIcon';
import { PlusIcon } from '../icons/plusIcon';
import { getToken } from '@/lib/server';
import UserPlusIcon from '../icons/userPlusIcon';
import { createStoreAdmin } from '@/lib/storeAdmin';

export default function ModalCreateStoreAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setEmail('');
    setMessage('');
  };

  const handleCreate = async () => {
    const data = {
      email,
    };

    try {
      const token = await getToken();

      const { result, ok } = await createStoreAdmin(data, token);
      setMessage(
        ok
          ? 'Store Admin berhasil dibuat!'
          : result.msg || 'Terjadi kesalahan!',
      );

      if (ok) window.location.reload();
      onClose();
    } catch (error) {
      setMessage('Gagal membuat Store Admin!');
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        endContent={<PlusIcon />}
        size="sm"
      >
        Add New
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Create Store Admin
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {message && <p className="text-red-500">{message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleCreate}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
