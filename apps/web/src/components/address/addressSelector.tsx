import { RootState } from '@/redux/store';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddressCard from './addressCard';
import { selectAddress } from '@/redux/slice/userSlice';
import { FaChevronDown } from 'react-icons/fa';
import { NewAddressModal } from '../modal/newAddressModal';

export const AddressSelector: React.FC = () => {
    const {
        isOpen: isAddressModalOpen,
        onOpen: onAddressModalOpen,
        onOpenChange: onAddressModalOpenChange,
      } = useDisclosure();
      const {
        isOpen: isNewAddressModalOpen,
        onOpen: onNewAddressModalOpen,
        onOpenChange: onNewAddressModalOpenChange,
      } = useDisclosure();
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const handleNewAddress = () => {
    onNewAddressModalOpen();
  };

  return (
    <div>
      {user.isLoggedIn ? (
        user.selectedAddress ? (
          <div onClick={onAddressModalOpen} className='flex items-center cursor-pointer'><p>Kirim ke: </p><span className='font-bold'>{user.selectedAddress.label.toUpperCase()}</span><FaChevronDown /></div>
        ) : (
          <div onClick={onAddressModalOpen} className='flex items-center cursor-pointer'>
            <p>JABODETABEK. Tidak ada alamat terdaftar atau alamat anda tidak
            terjangkau</p><FaChevronDown />
          </div>
        )
      ) : (
        <div>
          JABODETABEK. <span>Masuk untuk ubah lokasi</span>
        </div>
      )}

      <Modal
        isOpen={isAddressModalOpen}
        onOpenChange={onAddressModalOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size='lg'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mau di kirim kemana?
              </ModalHeader>
              <ModalBody>
                  {user.address && user.address.length > 0 ? (
                    user.address.map((address, index) => (
                      <AddressCard key={index} address={address} onSelect={() => {dispatch(selectAddress(address))}} />
                    ))
                  ) : (
                    <p>Tidak ada alamat terdaftar, silahkan buat alamat baru</p>
                  )}
                
              </ModalBody>
              <ModalFooter className='flex justify-center'>
                <Button fullWidth color='primary' onClick={handleNewAddress}>Buat Alamat Baru</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    
        <NewAddressModal isOpen={isNewAddressModalOpen} onOpenChange={onNewAddressModalOpenChange}/>
    </div>
  );
};
