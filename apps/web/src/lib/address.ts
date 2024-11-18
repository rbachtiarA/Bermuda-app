import { ICreateAddress, IFetchCity, ILocation } from '@/type/address';
import { getToken } from './server';
import { FormikHelpers } from 'formik';
import { stringify } from 'flatted';

export const getUserAddressess = async (userId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}users/userAddress/${userId}`,
    { next: { revalidate: 1 } },
  );
  const { status, data } = await res.json();

  return data;
};

export const getClientLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log('doesnt support');
  }
};

const showPosition = (position: any) => {
  console.log(position);
};
