import { IAddressList, ICreateAddress } from '@/type/address';
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
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import useFormAddress from '../../hooks/useFormAddress';
import * as yup from 'yup';
import { GoogleMapPicker } from '@/components/address/googleMapsPicker';

const formValidationSchema = yup.object().shape({
  label: yup.string().required('Masukkan rumah/kantor/kos/dll'),
  recipient: yup.string().required('Masukkan nama penerima'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'Hanya angka yang diperbolehkan')
    .required('Masukkan nomor handphone penerima'),
  addressLine: yup
    .string()
    .required('Masukkan nama jalan/nama bangunan/lantai/nomor rumah atau unit'),
});

export default function FormModal({
  isEdit,
  isCreating,
  selectedAddress,
  onClose,
}: {
  isEdit: boolean;
  isCreating: boolean;
  selectedAddress: IAddressList | null;
  onClose: () => void;
}) {
  const { initialValue, onSubmit } = useFormAddress({
    initialData: selectedAddress,
  });
  return (
    <Modal
      isOpen={isEdit || isCreating}
      onOpenChange={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="lg"
      scrollBehavior="outside"
      className="overflow-auto"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {isEdit ? 'Ubah data alamat' : 'Buat alamat baru'}
        </ModalHeader>
        <AddressForm
          initialValue={initialValue}
          onSubmit={onSubmit}
          closeModal={onClose}
        />
      </ModalContent>
    </Modal>
  );
}

function AddressForm({
  initialValue,
  onSubmit,
  closeModal,
}: {
  initialValue: ICreateAddress;
  onSubmit: (
    values: ICreateAddress,
    action: FormikHelpers<ICreateAddress>,
  ) => Promise<void>;
  closeModal: () => void;
}) {
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={formValidationSchema}
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
                  color={errors.label && touched.label ? 'primary' : 'default'}
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
              {/* <div>
                <CitySearchInput
                  handleSelect={(id) => {
                    setFieldValue('cityId', id);
                  }}
                  resetTrigger={isFormSubmitted}
                />
              </div> */}
              {/* <div>
                {showMap ? (
                  <GoogleMapPicker
                    onConfirm={(location) => {
                      setFieldValue('latitude', location.lat);
                      setFieldValue('longitude', location.lng);
                      setFieldValue('addressLine', location.addressLine);
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
              </div> */}

              <Checkbox
                isSelected={values.isPrimary}
                onChange={() => setFieldValue('isPrimary', !values.isPrimary)}
              >
                Jadikan alamat utama
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="ghost" onPress={closeModal}>
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
  );
}
