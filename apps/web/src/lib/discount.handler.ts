import { IDiscount, IDiscountBogo, IDiscountMinPur } from '@/type/discount';
import { getToken } from './server';

export const getDiscounts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}discount`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 1 },
  });

  if (!res.ok) {
    throw new Error('Faled to fetch discounts');
  }
  const result = await res.json();
  return { result, ok: res.ok };
};

export const getAvailableDiscountOnCheckout = async (storeId: number) => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}discount/store/${storeId}`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 1 },
    },
  );
  const { status, discount } = await res.json();

  return { status, discount };
};

export const createDiscount = async (
  data: IDiscount,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}discount/manual`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await res.json();
  return { result, ok: res.ok };
};

export const createDiscountMinPur = async (
  data: IDiscountMinPur,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}discount/conditional`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await res.json();
  return { result, ok: res.ok };
};

export const createDiscountBogo = async (
  data: IDiscountBogo,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}discount/bogo`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await res.json();
  return { result, ok: res.ok };
};
