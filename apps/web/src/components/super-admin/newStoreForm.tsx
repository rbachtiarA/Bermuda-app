import { useAppDispatch } from '@/redux/hook';
import { ICreateAddress, IFetchCity } from '@/type/address';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { GoogleMapPicker } from '../address/googleMapsPicker';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { createAddressHandler, fetchCities } from '@/lib/address';
import { CitySearchInput } from '../address/citySearchInput';
import { ICreateStore } from '@/type/store';
import { createStore } from '@/lib/superAdmin.handler';

interface NewStoreModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Masukkan nama toko'),
    location: Yup.string().required('Masukkan lokasi toko'),
    latitude: Yup.number().required('Pilih lokasi pada peta'),
    longitude: Yup.number().required('Pilih lokasi pada peta'),
    cityId: Yup.number().required('Pilih kota'),
  });

export const NewStoreForm: React.FC<NewStoreModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [cities, setCities] = useState<IFetchCity[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [markerAddress, setMarkerAddress] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const initialValues: ICreateStore = {
        name: '',
        location: '',
        latitude: 0,
        longitude: 0,
        cityId: 0
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCities();
        setCities(data);
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    };

    loadCities();
  }, []);

  const onSubmit = async (
    values: ICreateStore,
    action: FormikHelpers<ICreateStore>,
  ) => {
    try {
      console.log('Data yang diterima: ', values);
      const response = await createStore(values);
      console.log('Response:', response);
      action.resetForm();
      setMarkerAddress('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saat menyimpan alamat:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="lg"
      scrollBehavior='outside'
      className='overflow-auto'
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Tambah Alamat</ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props: FormikProps<ICreateStore>) => {
            const {
              values,
              errors,
              touched,
              handleBlur,
              setFieldValue,
              handleChange,
            } = props;
            return (
              <Form>
                <ModalBody>
                  <div>
                  <div>
                    <Input
                      placeholder="Ketik nama toko"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="name"
                      label="Nama Toko"
                      description="Masukkan nama toko"
                      color={errors.name && touched.name ? 'danger' : 'default'}
                    />
                  </div>
                    
                  <div>
                    <CitySearchInput
                      handleSelect={(id) => {
                        setFieldValue('cityId', id);
                      }}
                      resetTrigger={isFormSubmitted}
                    />
                  </div>
                  <div>
                    {showMap ? (
                      <GoogleMapPicker
                        onConfirm={(location) => { setFieldValue('latitude', location.lat); setFieldValue('longitude', location.lng); setFieldValue('location', location.addressLine);
                          setMarkerAddress(location.addressLine);
                          setShowMap(false);
                        }}
                      />
                    ) : (
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
                        {markerAddress && (
                          <p className="text-sm mt-2">{markerAddress}</p>
                        )}
                      </div>
                    )}
                  </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="ghost"
                    onPress={() => onOpenChange(false)}
                  >
                    Batal
                  </Button>
                  <Button color="primary" type="submit">
                    Simpan
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
