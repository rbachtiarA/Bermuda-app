import { getToken } from './server';
import { IStore } from '@/type/store';

export const PasswordlessPage = async (storeId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}store/stocks/${storeId}`,
    { next: { revalidate: 1 } },
  );
  const { status, stock } = await res.json();

  return stock;
};
export const getStoreOrders = async () => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}store/order`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 1 },
    },
  );
  const { status, msg, order } = await res.json();

  return { status, msg, order };
};
