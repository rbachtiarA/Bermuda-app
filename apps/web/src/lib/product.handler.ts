import { IProduct } from '@/type/product';

export const createProduct = async (
  data: {
    name: string;
    description: string;
    price: number;
    slug: string;
    isRecommended: boolean;
    categories: number[];
  },
  file: File | undefined,
  token: string | undefined,
) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (file) {
    formData.append('file', file);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}product/create`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error('Failed to create product');
    }

    const result = await res.json();
    return { result, ok: res.ok };
  } catch (error) {
    console.error('Error creating product:', error);
    return { result: null, ok: false };
  }
};

export const updateProduct = async (
  data: {
    id: number;
    name: string | undefined;
    description: string;
    price: number;
    slug: string;
    isRecommended?: boolean;
    categories?: string[];
    imageUrl: string | undefined;
  },
  file: File | undefined,
  token: string | undefined,
) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (file) {
    formData.append('file', file);
  }
  console.log(formData, '<<<<');

  const { id } = data;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}product/${id}`,
    {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const getProducts = async (
  search: string = '',
  currentPage: number = 1,
  pageSize: number = 10,
  categories: string = 'all',
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}product/products?search=${search}&page=${currentPage}&pageSize=${pageSize}&categories=${categories}`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();

  return {
    result,
    products: result.products,
    pagination: result.pagination,
    ok: res.ok,
  };
};

export const getProductById = async (
  productId: number,
): Promise<IProduct | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}product/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || 'Failed to fetch product');
    }
    const data = await res.json();
    return data.product;
  } catch (err) {
    console.error('Error fetching product:', err);
    throw err;
  }
};

export const deleteProduct = async (
  data: { id: number },
  token: string | undefined,
) => {
  const id = data.id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}product/${id}`,
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
