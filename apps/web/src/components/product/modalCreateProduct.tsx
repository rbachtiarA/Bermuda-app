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
} from '@nextui-org/react';
import { PlusIcon } from '../icons/plusIcon';
import { getToken } from '@/lib/server';
import { createProduct } from '@/lib/product.handler';
import { ICategory } from '@/type/category';
import { getCategories } from '@/lib/category.handler';

export default function ModalCreateProduct() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [slug, setSlug] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [message, setMessage] = useState('');

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setName('');
    setDescription('');
    setPrice(0);
    setSlug('');
    setIsRecommended(false);
    setSelectedCategories([]);
    setMessage('');
  };

  const handleCreate = async () => {
    const data = {
      name,
      description,
      price,
      slug,
      isRecommended,
      categories: selectedCategories,
    };
    try {
      const token = await getToken();
      const { result, ok } = await createProduct(data, file, token);

      if (ok && result) {
        setMessage('Product created successfully!');
        window.location.reload();
      } else {
        setMessage(result?.msg || 'Error occurred!');
      }

      onClose();
    } catch (error) {
      setMessage('Failed to create product!');
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

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!event.target.selectedOptions) return;

    const categoryIds = Array.from(event.target.selectedOptions, (option) =>
      parseInt(option.value, 10),
    );
    setSelectedCategories(categoryIds);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        endContent={<PlusIcon />}
        size="sm"
      >
        Add New Product
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Create Product</ModalHeader>
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
                multiple
                aria-label="Select Categories"
                value={selectedCategories.map(String)}
                onChange={handleCategoryChange}
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
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0])}
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
            <Button color="primary" onPress={handleCreate}>
              Create Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
