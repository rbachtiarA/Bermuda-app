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
  Input,
  Checkbox,
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
      categories: selectedCategories || [],
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

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategories(e.target.value.split(','));
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        endContent={<PlusIcon />}
        size="sm"
      >
        Add New
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Create Product</ModalHeader>
          <ModalBody>
            <Input
              id="name"
              type="text"
              label="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Enter product name"
              required
            />
            <Input
              id="description"
              type="text"
              label="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Enter product description"
              required
            />
            <Input
              id="price"
              type="number"
              label="Price"
              value={price.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(Number(e.target.value))
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-black-400 text-small">Rp</span>
                </div>
              }
              placeholder="0.000"
              required
            />
            <Input
              id="slug"
              type="text"
              label="Slug"
              value={slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSlug(e.target.value)
              }
              placeholder="Enter product slug"
              required
            />
            {/* <div className="mt-4">
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
            </div> */}
            <Select
              selectionMode="multiple"
              label="Select Categories"
              selectedKeys={selectedCategories}
              onChange={handleSelectionChange}
            >
              {categories?.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="no-categories" isDisabled value="">
                  No categories available
                </SelectItem>
              )}
            </Select>
            {/* <div className="mt-4">
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
            </div> */}

            <div className="mt-4">
              <label
                htmlFor="file-input"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Product Image
              </label>
              <Button
                as="label"
                htmlFor="file-input"
                className="mt-2"
                color="primary"
              >
                Choose File
              </Button>
              <Input
                id="file-input"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="hidden"
                accept="image/*"
                required
              />
            </div>

            <Checkbox
              isSelected={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
              size="lg"
              color="primary"
            >
              <span className="ml-2 text-sm">Is Recommended</span>
            </Checkbox>

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
