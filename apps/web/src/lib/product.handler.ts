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
