'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/product.handler'; // Adjust with the correct path for getProducts and getProCategory
import { getCategories, getProCategory } from '@/lib/category.handler';
import { getToken } from '@/lib/server';
import { ChangeEvent, FormEvent } from 'react';
import { Select, SelectSection, SelectItem } from '@nextui-org/select';
import { Button } from '@nextui-org/react';

// Define the type for pagination state
interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  slug: string;
  categories: string[]; // Array of objects
}

interface Category {
  id: number | null | undefined;
  name: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    slug: '',
    categories: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // File input state

  // Fetch categories when the component is mounted
  const fetchCategories = async () => {
    try {
      const { result, ok } = await getCategories();
      if (ok) {
        setCategories(result?.allCategory);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products, pagination: newPagination } = await getProducts(
        search,
        pagination.currentPage,
        pagination.pageSize,
        selectedCategory,
      );
      console.log(pagination, 'prodddd');

      setProducts(products);
      setPagination(newPagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when search, page, or category changes
  }, [search, pagination.currentPage, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handle modal open/close
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const seeDetail = (id: number) => {
    products.map((item: any) => {
      if (item.id == id) {
        setNewProduct({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          imageUrl: item.imageUrl,
          slug: item.slug,
          categories: item.categories.map((category: { id: any }) =>
            String(category.id),
          ),
        });
        console.log(newProduct, 'NEw');
      }
    });
    setIsModalOpen((prev) => !prev);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-z0-9\-]/g, '') // Remove non-alphanumeric characters (except dashes)
      .replace(/-+/g, '-') // Replace multiple dashes with a single dash
      .replace(/^-|-$/g, ''); // Remove dashes at the beginning and end
  };

  // Handle input changes for the new product
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => {
      const updatedProduct = {
        ...prev,
        [name]: name === 'categories' ? value.split(',') : value,
      };
      console.log(updatedProduct, '<><><'); // Log nilai yang baru, dalam callback
      return updatedProduct;
    });
  };

  // Handle file input change (image file)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const handleClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this stock?')) {
      try {
        // Kirim permintaan untuk menghapus stok
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}product/${id}`,
          {
            method: 'DELETE', // Menggunakan metode DELETE
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete the stock');
        }
        fetchProducts(); // Refresh the product list
        toggleModal(); // Close modal
        setNewProduct({
          id: '',
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          slug: '',
          categories: [],
        });
        setImageFile(null); // Reset file input

        // Jika penghapusan berhasil, arahkan kembali ke halaman sebelumnya atau ke halaman lain
      } catch (error: any) {
        console.error('Error creating product');
      }
    }
  };

  // Handle form submission for adding a product
  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const token = await getToken();
      const productData = {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        slug: generateSlug(newProduct.name),
        categories: newProduct.categories,
      };

      // Create a new FormData object
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      // Append the image file to FormData
      if (imageFile) {
        formData.append('file', imageFile); // Make sure the key matches what your server expects
      }

      // Step 1: Create the product with the image file included in the request body
      const createResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}product/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send FormData instead of JSON
        },
      );

      if (createResponse.ok) {
        fetchProducts(); // Refresh the product list
        toggleModal(); // Close modal
        setNewProduct({
          id: '',
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          slug: '',
          categories: [],
        });
        setImageFile(null); // Reset file input
      } else {
        console.error('Error creating product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg w-1/4"
        />
        <button
          onClick={toggleModal} // Open modal
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Add Product
        </button>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category?.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-lg"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p
                  className="text-gray-600 overflow-hidden text-ellipsis"
                  style={{ maxHeight: '100px' }}
                >
                  {product.description}
                </p>
                <div className="mt-4">
                  <span className="text-xl font-bold">${product.price}</span>
                </div>
                <Button onClick={() => seeDetail(Number(product.id))}>
                  see detail
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Product</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                name="categories"
                label="Favorite Animal"
                placeholder="Select an animal"
                selectionMode="multiple"
                className="max-w-xs"
                value={newProduct.categories}
                onChange={handleInputChange}
              >
                {categories?.map((x) => (
                  <SelectItem key={String(x.id)}>{x.name}</SelectItem>
                ))}
              </Select>
              <label className="block text-sm font-medium mb-2">Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={toggleModal}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleClick(Number(newProduct.id))}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-green-600"
              >
                Delete
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
