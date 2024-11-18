import { ICreateAddress, IFetchCity, ILocation } from '@/type/address';
import { getToken } from './server';
import { useAppDispatch } from '@/redux/hook';
import { setLocation } from '@/redux/slice/userSlice';

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

export const fetchCities = async (): Promise<IFetchCity[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}address/cities`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    const data: IFetchCity[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const createAddressHandler = async (value: ICreateAddress) => {
  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}address/`, {
    method: 'POST',
    body: JSON.stringify(value),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const { status, msg } = await res.json();

  return { status, msg };
};

export const getShippingCost = async (addressId: number, storeId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}address/shippingCost?addressId=${addressId}&storeId=${storeId}`,
    { cache: 'no-cache' },
  );
  const { status, msg } = await res.json();
  return { status, msg };
};
