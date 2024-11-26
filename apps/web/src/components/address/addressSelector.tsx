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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddressCard from './addressCard';
import { selectAddress } from '@/redux/slice/userSlice';
import { FaChevronDown } from 'react-icons/fa';
import { NewAddressModal } from './newAddressModal';
import { getUserAddressess } from '@/lib/address';
import { IAddressList } from '@/type/address';

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
  const [addressList, setAddressList] = useState<IAddressList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const getData = async () => {
    try {
      setLoading(true);
      const data: IAddressList[] = await getUserAddressess(user.id);
      setAddressList(data); 
    } catch (error) {
      console.error('Error fetching address data:', error);
      setAddressList([]); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      getData();
    }
  }, [user.isLoggedIn]);

  const dispatch = useDispatch();

  const handleNewAddress = () => {
    onNewAddressModalOpen();
  };

  return (
    <div>
      {user.isLoggedIn ? (
        user.selectedAddress ? (
          <div
            onClick={onAddressModalOpen}
            className="flex items-center cursor-pointer"
          >
            <p>Kirim ke: </p>
            <span className="font-bold">
              {user.selectedAddress.label.toUpperCase()}
            </span>
            <FaChevronDown />
          </div>
        ) : (
          <div
            onClick={onAddressModalOpen}
            className="flex items-center cursor-pointer"
          >
            <p>
              JABODETABEK. Tidak ada alamat terdaftar atau alamat anda tidak
              terjangkau
            </p>
            <FaChevronDown />
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
        size="lg"
        scrollBehavior="outside"
        className="overflow-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mau di kirim kemana?
              </ModalHeader>
              <ModalBody>
                {addressList && addressList.length > 0 ? (
                  addressList.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onSelect={() => {
                        dispatch(selectAddress(address));
                        onClose();
                      }}
                      onDeleteSuccess={getData}
                    />
                  ))
                ) : (
                  <p>Tidak ada alamat terdaftar, silahkan buat alamat baru</p>
                )}
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button fullWidth color="primary" onClick={handleNewAddress}>
                  Buat Alamat Baru
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <NewAddressModal
        isOpen={isNewAddressModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            getData();
          }
          onNewAddressModalOpenChange();
        }}
      />
    </div>
  );
};
