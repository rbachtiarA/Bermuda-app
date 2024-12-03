import { getToken } from '@/lib/server';
import { getStoreAdminById, updateStoreAdmin } from '@/lib/storeAdmin';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { EditIcon } from '../icons/editIcon';
import { IStoreAdmin } from '@/type/storeAdmin';
import { MailIcon } from '../icons/mailIcon';
import { toast } from 'react-toastify';

export default function UpdateStoreAdmin({
  storeAdminId,
  onUpdate,
}: {
  storeAdminId: number;
  onUpdate: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<IStoreAdmin>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onClose = () => {
    setIsOpen(false);
    setName('');
    setEmail('');
    setPassword('');
    setMessage('');
  };

  console.log(storeAdminId, 'STOREID');

  const fetchUserById = async (id: number) => {
    try {
      const res = await getStoreAdminById(storeAdminId);

      console.log(res, 'RESS');
      if (res) {
        const data = res;
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPassword('');
        setIsOpen(true);
      } else {
        setMessage('User not found');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengambil data.');
    }
  };

  const handleUpdate = async () => {
    const data = {
      id: storeAdminId || 0,
      name: name || '',
      email: email || '',
      password: password || '',
    };
    try {
      const token = await getToken();
      const { result, ok } = await updateStoreAdmin(data, token);

      if (ok && result) {
        toast.success('Data berhasil diperbarui');
        setMessage('Data berhasil diperbarui');
        setIsOpen(false);
        // await onUpdate();
      } else {
        setMessage('Error occurred!');
      }

      onClose();
    } catch (error) {
      setMessage('Failed to updated product!');
    }
  };

  return (
    <>
      <Tooltip color="secondary" content="Edit Store Admin">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={() => fetchUserById(storeAdminId)}
        >
          <EditIcon />
        </span>
      </Tooltip>
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
            <Input
              autoFocus
              label="Name"
              placeholder="Enter your name"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {message && <p className="text-red-500">{message}</p>}
            <Input
              autoFocus
              label="password"
              placeholder="Enter your New Password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {message && <p className="text-red-500">{message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button type="button" color="primary" onPress={handleUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
