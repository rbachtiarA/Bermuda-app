import { IStore } from '@/type/store';
import { getToken } from './server';

export const getStoreStock = async (storeId: number) => {
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

export const getAllStore = async () => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}store/stores`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 1 },
    },
  );
  // const { stores } = await res.json();
  // console.log(stores, '<<>><><><>>');

  const { status, msg, stores } = await res.json();

  return { status, msg, stores };
};

export const getNearestStore = async (lat: number, lon: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}store/nearest?lat=${lat}&lon=${lon}`)
  const { status, msg, distance }: { status: string, msg: IStore, distance: number } = await res.json()
  
  return { status, msg, distance }
}
export const getStoresList = async () => {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}store/`, {
      headers: {
          "Content-type":"application/json",
          'Authorization': `Bearer ${token}`
      }
  })
  const { status, msg }: { status: string, msg: IStore[] } = await res.json()

  return { status, msg }
}