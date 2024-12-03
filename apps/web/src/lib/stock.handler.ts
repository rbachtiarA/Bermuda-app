import { IStockCreate } from '@/type/stock';

export const getStocks = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}stock`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 1 },
  });

  if (!res.ok) {
    throw new Error('Faled to fetch stocks');
  }
  const result = await res.json();
  return { result, ok: res.ok };
};

export const createStock = async (
  data: IStockCreate,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}stock/create`,
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

export const updateStock = async (
  data: { id: number; productId: number; storeId: number; quantity: number },
  token: string | undefined,
) => {
  const { id } = data;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}stock/${id}`,
    {
      method: 'PUT',
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

export const deleteStock = async (
  data: { id: number },
  token: string | undefined,
) => {
  const id = data.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}stock/${id}`,
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

export const getStockById = async (data: { id: number; name: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}stock/${data.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await res.json();
  return { result, ok: res.ok };
};

export const getStockHistory = async (
  stockId: number,
  userId: number,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}stock/history/${userId}`,
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
