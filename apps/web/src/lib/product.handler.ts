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

    // Memeriksa jika respons statusnya OK
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

export const getProducts = async (
  search: string = '',
  currentPage: number = 1,
  pageSize: number = 10,
  categories: string = 'all',
) => {
  console.log(currentPage, 'PAGEE');

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

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/product/${slug}`,
    );
    if (!response.ok) throw new Error('Failed to fetch product details');
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
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
