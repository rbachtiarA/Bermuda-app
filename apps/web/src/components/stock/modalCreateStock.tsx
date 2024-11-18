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
import { createStock, getStocks } from '@/lib/stock.handler';
import { IStock } from '@/type/stock';
import { getProducts } from '@/lib/product.handler';
import { IProduct } from '@/type/product';
import { getAllStore, getStoreOrders } from '@/lib/store.handler';
import { IStore } from '@/type/store';

export default function ModalCreateStock() {
  const [isOpen, setIsOpen] = useState(false);
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const [productId, setProductId] = useState(0);
  const [storeId, setStoreId] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [message, setMessage] = useState('');

  const onOpen = () => setIsOpen(true);

  const onClose = () => {
    setIsOpen(false);
    setProductId(0);
    setStoreId(0);
    setQuantity(0);
    setMessage('');
  };

  const handleCreate = async () => {
    const data = { productId, storeId, quantity };

    try {
      const token = await getToken();

      const { result, ok } = await createStock(data, token);
      setMessage(
        ok ? 'Kategori berhasil dibuat!' : result.msg || 'Terjadi kesalahan!',
      );

      if (ok) window.location.reload();
      onClose();
    } catch (error) {
      setMessage('Gagal membuat kategori!');
    }
  };

  console.log(productId, 'productid');
  console.log(stores, 'stores');

  const handleFetch = async () => {
    const data = { productId, storeId, quantity };

    try {
      const token = await getToken();

      const { result, ok } = await getStocks();
      if (ok) {
        setStocks(result);
      }
    } catch (error) {
      setMessage('Gagal membuat kategori!');
    }
  };

  const fetchProduct = async () => {
    try {
      const token = await getToken();
      const { result, ok } = await getProducts();
      if (ok) {
        setProducts(result.products);
      }
    } catch (error) {
      console.log('Error fetch Product');
    }
  };

  const fetchStores = async () => {
    try {
      const token = await getToken();
      const { stores } = await getAllStore();
      if (stores) {
        setStores(stores);
        console.log(stores, 'STORESS');
      }
    } catch (error) {
      console.log('Error fetch Product');
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchStores();
  }, []);

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
          <ModalHeader className="flex flex-col gap-1">
            Create Stock
          </ModalHeader>
          <ModalBody>
            <Select
              label="Select an product"
              className="max-w-xs"
              onChange={(e) => setProductId(Number(e.target.value))}
            >
              {products.map((product) => (
                <SelectItem key={product.id}>{product.name}</SelectItem>
              ))}
            </Select>
            <Select
              label="Select an store"
              className="max-w-xs"
              onChange={(e) => setStoreId(Number(e.target.value))}
            >
              {stores.map((stores) => (
                <SelectItem key={stores.id}>{stores.name}</SelectItem>
              ))}
            </Select>

            {message && <p className="text-red-500">{message}</p>}
            {/* Input Quantity */}
            <div className="mt-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter quantity"
                min={1} // Optional: Set minimum value
                required // Optional: Mark field as required
              />
            </div>

            {message && <p className="text-red-500 mt-2">{message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleCreate}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
