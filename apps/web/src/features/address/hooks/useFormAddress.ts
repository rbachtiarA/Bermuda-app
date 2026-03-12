import { IAddressList, ICreateAddress } from '@/type/address';
import { FormikHelpers } from 'formik';
import { useState } from 'react';

const DEFAULT_VALUES: ICreateAddress = {
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

export default function useFormAddress({
  initialData,
}: {
  initialData?: IAddressList | null;
}) {
  const [showMap, setShowMap] = useState(false);
  const [mapMarker, setMapMarker] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const initialValue: ICreateAddress = initialData
    ? {
        label: initialData.label,
        recipient: initialData.recipient,
        phoneNumber: initialData.phoneNumber,
        cityId: initialData.cityId,
        state: initialData.state,
        addressLine: initialData.addressLine,
        postalCode: initialData.postalCode,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        isPrimary: initialData.isPrimary,
      }
    : DEFAULT_VALUES;

  const onSubmit = async (
    values: ICreateAddress,
    action: FormikHelpers<ICreateAddress>,
  ) => {
    try {
    } catch (error) {}
  };

  return {
    initialValue,
    onSubmit,
  };
}
