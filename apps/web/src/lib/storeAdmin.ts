import { IStoreAdminReg } from '@/type/storeAdmin';

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
