import { ICategoryCreate } from '@/type/category';

export const getCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}category/categories`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'appliication/json',
      },
      next: { revalidate: 1 },
    },
  );

  if (!res.ok) {
    throw new Error('Faled to fetch categories');
  }
  const result = await res.json();
  return { result, ok: res.ok };
};

export const createCategory = async (
  data: ICategoryCreate,
  token: string | undefined,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}category/create`,
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

export const updateCategory = async (
  data: { id: number; name: string },
  token: string | undefined,
) => {
  const { id, name } = data;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}category/update/${id}`,
    {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const deleteCategory = async (
  data: { id: number },
  token: string | undefined,
) => {
  const id = data.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}category/delete/${id}`,
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

export const getProCategory = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}procategory/categories`,
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
