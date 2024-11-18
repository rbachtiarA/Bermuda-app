import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tooltip,
} from '@nextui-org/react';
import { getToken } from '@/lib/server';
import { EditIcon } from '../icons/editIcon';
import { updateCategory } from '@/lib/category.handler';

export default function UpdateCategory({ categoryId }: { categoryId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setName('');
    setMessage('');
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      setMessage('Nama kategori tidak boleh kosong.');
      return;
    }

    try {
      const token = await getToken();
      const data = { id: categoryId, name };
      const { result, ok } = await updateCategory(data, token);
      setMessage(
        ok
          ? 'Kategori berhasil diperbarui!'
          : result?.msg || 'Terjadi kesalahan.',
      );
      if (ok) window.location.reload();
      onClose();
    } catch (error) {
      setMessage('Gagal memperbarui kategori.');
    }
  };

  return (
    <>
      {/* Tooltip dengan ikon edit */}
      <Tooltip color="primary" content="Edit category">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>

      {/* Modal untuk Update Category */}
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Update Category
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
            {message && (
              <p
                className={`text-${
                  message.includes('berhasil') ? 'green' : 'red'
                }-500`}
              >
                {message}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
