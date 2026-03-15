import { useAppSelector } from '@/redux/hook';
import { selectUser } from '@/redux/selector/userSelector';
import { useDisclosure } from '@nextui-org/react';
import { FaChevronDown } from 'react-icons/fa';
import useAddressList from '../hooks/useAddressList';
import MainModal from './modal/MainModal';

export default function AddressListView() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user = useAppSelector(selectUser);
  const { addressList } = useAddressList();

  const isLoggedIn = user.isLoggedIn;
  const hasAddress = user.selectedAddress;

  if (!isLoggedIn) {
    return (
      <div>
        <span>JABODETABEK</span>
        <span>Masuk untuk ubak lokasi</span>
      </div>
    );
  }

  if (!hasAddress) {
    return (
      <button
        onClick={onOpen}
        aria-label="create address"
        className="flex gap-1 items-center cursor-pointer"
      >
        <span>JABODETABEK.</span>
        <span>Belum ada alamat yang terdaftar</span>
        <FaChevronDown />
        <MainModal isOpen={isOpen} data={addressList} onOpen={onOpen} />
      </button>
    );
  }

  return (
    <button
      onClick={onOpen}
      aria-label="select address"
      className="flex gap-1 items-center cursor-pointer"
    >
      <span>Kirim ke: </span>
      <span>{hasAddress.label.toUpperCase()}</span>
      <FaChevronDown />
      <MainModal isOpen={isOpen} data={addressList} onOpen={onOpenChange} />
    </button>
  );
}
