import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import { getToken } from '@/lib/server';
import { getProductById, updateProduct } from '@/lib/product.handler';
import { ICategory } from '@/type/category';
import { getCategories } from '@/lib/category.handler';
import { IProduct } from '@/type/product';
import { EditIcon } from '../icons/editIcon';

export default function UpdateProduct({
  productId,
  onUpdate,
}: {
  productId: number;
  onUpdate: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [product, setProduct] = useState<IProduct>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [slug, setSlug] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [message, setMessage] = useState('');

  const onClose = () => {
    setIsOpen(false);
    setName('');
    setDescription('');
    setPrice(0);
    setSlug('');
    setIsRecommended(false);
    setSelectedCategories([]);
    setMessage('');
    setImageUrl('');
  };

  const fetchProductById = async (id: number) => {
    try {
      const token = await getToken();
      const res = await getProductById(productId);

      if (res) {
        const data = res;
        setProduct(data);
        setImageUrl(data.imageUrl);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setSlug(data.slug);
        setIsRecommended(data.isRecommended || false);
        const result: string[] =
          data?.categories?.map((item: any) => String(item.id)) || [];
        setSelectedCategories(result);
        setIsOpen(true);
      } else {
        setMessage('Gagal mendapatkan detail stok.');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengambil data.');
    }
  };

  const handleUpdate = async () => {
    const data = {
      id: productId || 0,
      name: name || '',
      description: description || '',
      price: price || 0,
      slug: slug || '',
      isRecommended: isRecommended || false,
      categories: selectedCategories || [],
      imageUrl: imageUrl || '',
    };
    try {
      const token = await getToken();
      const { result, ok } = await updateProduct(data, file, token);

      if (ok && result) {
        setMessage('Product updated successfully!');
        setIsOpen(false);
        await onUpdate();
      } else {
        setMessage(result?.msg || 'Error occurred!');
      }

      onClose();
    } catch (error) {
      setMessage('Failed to updated product!');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const { result, ok } = await getCategories();
      if (ok) {
        setCategories(result.allCategory);
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategories(e.target.value.split(','));
  };

  return (
    <>
      <Tooltip color="primary" content="Edit product">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={() => fetchProductById(productId)}
        >
          <EditIcon />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalBody>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter product price"
                required
                min="0"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter product slug"
                required
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="isRecommended"
                className="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  id="isRecommended"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-sm">Is Recommended</span>
              </label>
            </div>
            <div className="mt-4">
              <Select
                selectionMode="multiple"
                aria-label="Select Categories"
                selectedKeys={selectedCategories}
                onChange={handleSelectionChange}
              >
                {categories?.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="no-categories" isDisabled value="">
                    No categories available
                  </SelectItem>
                )}
              </Select>
            </div>
            <div className="mt-4">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Product Image
              </label>
              {imageUrl && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Current Image:</p>
                  <img
                    src={imageUrl || ''}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <input
                id="file"
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    const filePreviewUrl = URL.createObjectURL(selectedFile);
                    setImageUrl(filePreviewUrl);

                    if (imageUrl) {
                      URL.revokeObjectURL(imageUrl);
                    }
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-300 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                accept="image/*"
                required
              />
            </div>

            {message && <p className="text-red-500 mt-2">{message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleUpdate}>
              Update Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
function item(value: number, index: number, array: number[]): unknown {
  throw new Error('Function not implemented.');
}
