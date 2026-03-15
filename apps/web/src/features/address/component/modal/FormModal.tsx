import { IAddressList, ICreateAddress } from '@/type/address';
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import useFormAddress from '../../hooks/useFormAddress';
import MapPicker from '../../../shared/components/map/tiles';
import { CitySearchInput } from '@/components/address/citySearchInput';

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
  state: yup.string().required('provinsi'),
  postalCode: yup
    .string()
    .matches(/^[0-9]{5}$/, 'Kode pos harus 5 digit angka')
    .required('Masukkan kode pos'),
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
  const { initialValue, onSubmit, isLoading } = useFormAddress({
    initialData: selectedAddress,
    onClose,
  });

  return (
    <Modal
      isOpen={isEdit || isCreating}
      onOpenChange={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="lg"
      scrollBehavior="inside"
      placement="top"
      className="overflow-auto"
    >
      <ModalContent>
        <ModalHeader className="flex gap-2">
          <span>{isEdit ? 'Ubah data alamat' : 'Buat alamat baru'}</span>
          {isLoading && <Spinner size="sm" />}
        </ModalHeader>
        <AddressForm
          initialValue={initialValue}
          onSubmit={onSubmit}
          closeModal={onClose}
          isLoading={isLoading}
        />
      </ModalContent>
    </Modal>
  );
}

function AddressForm({
  initialValue,
  isLoading,
  onSubmit,
  closeModal,
}: {
  initialValue: ICreateAddress;
  isLoading: boolean;
  onSubmit: (
    values: ICreateAddress,
    action: FormikHelpers<ICreateAddress>,
  ) => Promise<void>;
  closeModal: () => void;
}) {
  const [show, setShow] = useState<boolean>(false);

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
          <>
            <ModalBody className="gap-4">
              <Form id="form-address">
                {/* Label & Contact Section */}
                <div>
                  <p className="text-sm font-medium text-default-600 mb-2">
                    Informasi Penerima
                  </p>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Ketik label alamat"
                      value={values.label}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="label"
                      label="Label Alamat"
                      description="Contoh: Rumah, Kantor, Kos"
                      isInvalid={!!(errors.label && touched.label)}
                      errorMessage={touched.label && errors.label}
                    />
                    <div className="flex gap-3">
                      <Input
                        placeholder="Ketik nama penerima"
                        value={values.recipient}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="recipient"
                        label="Nama Penerima"
                        isInvalid={!!(errors.recipient && touched.recipient)}
                        errorMessage={touched.recipient && errors.recipient}
                      />
                      <Input
                        placeholder="Contoh: 08123456789"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="phoneNumber"
                        label="No. Handphone"
                        isInvalid={
                          !!(errors.phoneNumber && touched.phoneNumber)
                        }
                        errorMessage={touched.phoneNumber && errors.phoneNumber}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Detail Section */}
                <Divider className="mt-4 mb-2" />
                <div>
                  <p className="text-sm font-medium text-default-600 mb-2">
                    Detail Alamat
                  </p>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Contoh: Jl. Sudirman No. 10, Gedung A Lt. 3"
                      value={values.addressLine}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="addressLine"
                      label="Alamat Lengkap"
                      description="Nama jalan, nomor rumah/unit, nama gedung, lantai"
                      isInvalid={!!(errors.addressLine && touched.addressLine)}
                      errorMessage={touched.addressLine && errors.addressLine}
                    />
                    <Input
                      placeholder="Contoh: Jakarta Selatan"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="province"
                      label="Provinsi (automatis terisi saat pilih kab/kota)"
                      isReadOnly
                      isInvalid={!!(errors.state && touched.state)}
                      errorMessage={touched.state && errors.state}
                      className="flex-1"
                    />
                    <div className="flex gap-3 w-full">
                      <CitySearchInput
                        value={values.city}
                        handleSelect={(id, province) => {
                          setFieldValue('cityId', id);
                          setFieldValue('state', province);
                        }}
                      />
                      <Input
                        placeholder="Contoh: 12190"
                        value={values.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="postalCode"
                        label="Kode Pos"
                        maxLength={5}
                        isInvalid={!!(errors.postalCode && touched.postalCode)}
                        errorMessage={touched.postalCode && errors.postalCode}
                        className="w-36"
                      />
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <Divider className="mt-4 mb-2" />
                <div>
                  <p className="text-sm font-medium text-default-600 mb-2">
                    Lokasi di Peta (pilih titik terdekat)
                  </p>
                  {show && (
                    <div className="mb-3">
                      <MapPicker
                        lat={values.latitude}
                        lng={values.longitude}
                        setValue={(lng, lat) => {
                          setFieldValue('latitude', lat);
                          setFieldValue('longitude', lng);
                        }}
                      />
                    </div>
                  )}
                  <Button
                    color="primary"
                    variant="ghost"
                    fullWidth
                    onPress={() => setShow((prev) => !prev)}
                  >
                    {show ? 'Tutup Peta' : 'Buka Peta'}
                  </Button>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="ghost"
                onPress={closeModal}
                isDisabled={isLoading}
              >
                Batal
              </Button>
              <Button
                color="primary"
                type="submit"
                form="form-address"
                isDisabled={isLoading}
              >
                Simpan
              </Button>
            </ModalFooter>
          </>
        );
      }}
    </Formik>
  );
}
