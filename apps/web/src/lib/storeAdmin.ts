import { IStoreAdmin, IStoreAdminReg } from '@/type/storeAdmin';
import { getToken } from './server';

export const createStoreAdmin = async (
  data: IStoreAdminReg,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}storeadmin/create`,
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

export const getAllStoreAdmin = async (token: string | undefined) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}storeadmin/storeadmins`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const getStoreAdminById = async (
  id: number,
): Promise<IStoreAdmin | null> => {
  try {
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}storeadmin/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || 'Failed to fetch product');
    }
    const data = await res.json();
    return data.storeAdmin;
  } catch (err) {
    console.error('Error fetching product:', err);
    throw err;
  }
};

export const updateStoreAdmin = async (
  data: { id: number; name: string; email: string; password: string },
  token: string | undefined,
) => {
  const { id, name, email, password } = data;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}storeadmin/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify({ name, email, password }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const deleteStoreAdmin = async (
  data: { id: number },
  token: string | undefined,
) => {
  const id = data.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}storeadmin/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};
