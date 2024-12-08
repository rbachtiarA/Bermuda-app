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
import { PlusIcon } from '../icons/plusIcon';
import { getToken } from '@/lib/server';
import { createCategory } from '@/lib/category.handler';

export default function ModalCreateCategory({fetchCategories}: {fetchCategories: () => Promise<void>}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const onOpen = () => setIsOpen(true);

  const onClose = () => {
    setIsOpen(false);
    setName('');
    setMessage('');
  };

  const handleCreate = async () => {
    const data = { name };

    try {
      const token = await getToken();

      const { result, ok } = await createCategory(data, token);
      setMessage(
        ok ? 'Kategori berhasil dibuat!' : result.msg || 'Terjadi kesalahan!',
      );

      if (ok) fetchCategories()
      onClose();
    } catch (error) {
      setMessage('Gagal membuat kategori!');
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
            Create Category
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Category Name"
              placeholder="Enter category name"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
