import { createAddressHandler, updateAddressHandler } from '@/lib/address';
import { useAppDispatch } from '@/redux/hook';
import { addAddress, updateAddress } from '@/redux/slice/userSlice';
import { IAddressList, ICreateAddress } from '@/type/address';
import { FormikHelpers } from 'formik';
import { useState } from 'react';

const DEFAULT_VALUES: ICreateAddress = {
  label: '',
  recipient: '',
  phoneNumber: '',
  cityId: 0,
  city: '',
  state: '',
  addressLine: '',
  postalCode: '',
  latitude: -6.21462,
  longitude: 106.84513,
  isPrimary: false,
};

export default function useFormAddress({
  initialData,
  onClose,
}: {
  initialData?: IAddressList | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        city: initialData.city,
      }
    : DEFAULT_VALUES;

  const onSubmit = async (
    values: ICreateAddress,
    action: FormikHelpers<ICreateAddress>,
  ) => {
    try {
      setIsLoading(true);
      if (initialData?.id) {
        const res = await updateAddressHandler(initialData.id, values);
        dispatch(addAddress(res));
      } else {
        const res = await createAddressHandler(values);
        dispatch(updateAddress(res));
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initialValue,
    isLoading,
    onSubmit,
  };
}
