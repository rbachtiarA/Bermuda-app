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

interface UpdateStoreAdminProps {
  storeAdminId: number;
}

export default function UpdateStoreAdmin({
  storeAdminId,
}: UpdateStoreAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setEmail('');
    setName('');
    setPassword('');
    setMessage('');
  };

  const handleUpdate = async () => {
    // Validate input fields
    if (!email && !name && !password) {
      setMessage('At least one field must be provided for update.');
      return;
    }

    try {
      const token = await getToken();

      const response = await fetch(`/api/storeadmin/${storeAdminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Store Admin updated successfully!');
        onClose();
        window.location.reload(); // Refresh the page to fetch updated data
      } else {
        setMessage(result?.msg || 'Failed to update Store Admin.');
      }
    } catch (error) {
      setMessage('An error occurred while updating the Store Admin.');
    }
  };

  return (
    <>
      <Tooltip color="primary" content="Edit Store Admin">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Update Store Admin
          </ModalHeader>
          <ModalBody>
            <Input
              label="Email"
              placeholder="Enter new email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Name"
              placeholder="Enter new name"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter new password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {message && (
              <p
                className={`text-${
                  message.includes('successfully') ? 'green' : 'red'
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
