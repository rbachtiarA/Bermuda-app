import { useAppDispatch } from '@/redux/hook';
import { ILocation } from '@/type/address';
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
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { GoogleMapPicker } from '../address/googleMapsPicker';

interface NewAddressModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export const NewAddressModal: React.FC<NewAddressModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState({
    label: '',
    recipient: '',
    phoneNumber: '',
    addressLine: '',
    latitude: 0,
    longitude: 0,
    city: '',
    state: '',
    postalCode: '',
    isPrimary: false,
  });

  const dispatch = useAppDispatch();

  const handleMapConfirm = (location: ILocation) => {
    setAddress({
      ...address,
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      state: location.state,
    });
    console.log('Data dari google map: ', address);
    setShowMap(false);
  };

  const handleSaveAddress = () => {
    onOpenChange(false);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tambah Alamat
              </ModalHeader>
              <ModalBody>
                <div>
                  <p>Label Alamat</p>
                </div>
                <div className="flex gap-3">
                  <p>Nama Penerima</p>
                  <p>No. Hanpdhone</p>
                </div>
                {showMap ? (
                  <GoogleMapPicker onConfirm={handleMapConfirm} />
                ) : (
                  <div className='flex gap-3 w-full'>
                    <div>
                      <p>Pilih Kota</p>
                    </div>
                    <div>
                      <p>Tandai Lokasi</p>
                      <Button
                        fullWidth
                        color="default"
                        variant="light"
                        onClick={() => setShowMap(true)}
                        className="shadow-lg"
                      >
                        Tandai Lokasi
                      </Button>
                    </div>
                  </div>
                )}

                <div>Alamat Lengkap</div>
                <div>jadikan alamat utama</div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="ghost" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={onClose}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
