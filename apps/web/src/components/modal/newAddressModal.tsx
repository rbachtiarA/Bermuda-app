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

interface NewAddressModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = Yup.object().shape({
  label: Yup.string().required('Masukkan rumah/kantor/kos/dll'),
  recipient: Yup.string().required('Masukkan nama penerima'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Hanya angka yang diperbolehkan')
    .required('Masukkan nomor handphone penerima'),
  addressLine: Yup.string().required(
    'Masukkan nama jalan/nama bangunan/lantai/nomor rumah atau unit',
  ),
  // latitude: Yup.number().required("Pilih lokasi pada peta"),
  // longitude: Yup.number().required("Pilih lokasi pada peta"),
});
export const NewAddressModal: React.FC<NewAddressModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [cities, setCities] = useState<IFetchCity[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [markerAddress, setMarkerAddress] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const initialValues: ICreateAddress = {
    label: '',
    recipient: '',
    phoneNumber: '',
    cityId: 0,
    state: 'Kota',
    addressLine: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    isPrimary: false,
  };

  const dispatch = useAppDispatch();

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
    values: ICreateAddress,
    action: FormikHelpers<ICreateAddress>,
  ) => {
    try {
      console.log('Data yang diterima: ', values);
      const response = await createAddressHandler(values);
      console.log('Response:', response);
      action.resetForm();
      setMarkerAddress('');
      setIsFormSubmitted(true);
      setTimeout(() => setIsFormSubmitted(false), 100);
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
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Tambah Alamat</ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props: FormikProps<ICreateAddress>) => {
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
                    <Input
                      placeholder="Ketik label alamat"
                      value={values.label}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="label"
                      label="Label Alamat"
                      description="Masukkan rumah/kantor/kos/dll"
                      color={
                        errors.label && touched.label ? 'primary' : 'default'
                      }
                    />
                  </div>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ketik nama penerima"
                      value={values.recipient}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="recipient"
                      label="Nama Penerima"
                      description="Masukkan nama penerima"
                      color={
                        errors.recipient && touched.recipient
                          ? 'primary'
                          : 'default'
                      }
                    />
                    <Input
                      placeholder="Ketik nomor handphone penerima"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="phoneNumber"
                      label="No. Handphone"
                      description="Masukkan nomor handphone penerima"
                      color={
                        errors.phoneNumber && touched.phoneNumber
                          ? 'primary'
                          : 'default'
                      }
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
                        onConfirm={(location) => { setFieldValue('latitude', location.lat); setFieldValue('longitude', location.lng); setFieldValue('addressLine', location.addressLine);
                          setFieldValue('state', location.state);
                          setFieldValue('postalCode', location.postalCode);
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
                  <div>
                    <Checkbox
                      isSelected={values.isPrimary}
                      onChange={() =>
                        setFieldValue('isPrimary', !values.isPrimary)
                      }
                    >
                      Jadikan alamat utama
                    </Checkbox>
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
