import { deleteAddress } from '@/lib/address';
import { useAppDispatch } from '@/redux/hook';
import { removeAddress } from '@/redux/slice/userSlice';
import { IAddressList } from '@/type/address';
import { useState } from 'react';

type ModalType = 'add' | 'remove' | 'edit' | null;

export default function useModalAddress() {
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedAddress, setSelectedAddress] = useState<IAddressList | null>(
    null,
  );

  const onCreate = () => {
    setModal('add');
  };

  const onRemove = (address: IAddressList) => {
    setModal('remove');
    setSelectedAddress(address);
  };

  const onEdit = (address: IAddressList) => {
    setSelectedAddress(address);
    setModal('edit');
  };

  const onClose = () => {
    setSelectedAddress(null);
    setModal(null);
  };

  const handleRemove = async () => {
    try {
      if (selectedAddress) {
        const response = await deleteAddress(selectedAddress);
        if (response.status) {
          dispatch(removeAddress(selectedAddress));
        }
      }
    } catch (error) {
    } finally {
      setSelectedAddress(null);
    }
  };

  return {
    modal,
    selectedAddress,
    onCreate,
    onEdit,
    onRemove,
    handleRemove,
    onClose,
  };
}
