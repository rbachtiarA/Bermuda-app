import { useState } from 'react';
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
import { EditIcon } from '../icons/editIcon';
import { getStockById, updateStock } from '@/lib/stock.handler';
import { getAllStore } from '@/lib/store.handler';
import { getProducts } from '@/lib/product.handler';
import { IProduct } from '@/type/product';
import { IStore } from '@/type/store';

export default function UpdateStock({ stockId }: { stockId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const [message, setMessage] = useState('');
  const [productId, setProductId] = useState(0);
  const [storeId, setStoreId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false); // State untuk loading API detail

  console.log(quantity, 'QUANTI');
  console.log(productId, 'QUANTI');
  console.log(storeId, 'QUANTI');

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

  // Fungsi untuk mengambil detail stok
  const fetchStockDetails = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { result, ok } = await getStockById({ id: stockId, name: '' });

      if (ok) {
        const data = result.data;
        setProductId(data.product.id);
        setStoreId(data.store.id);
        setQuantity(data.quantity);
        setIsOpen(true);
      } else {
        setMessage('Gagal mendapatkan detail stok.');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  const onOpen = async () => {
    await fetchStockDetails(); // Hit API detail stok
    await fetchStores();
    await fetchProduct();
  };

  const onClose = () => {
    setIsOpen(false);
    setProductId(0);
    setStoreId(0);
    setQuantity(0);
    setMessage('');
  };

  const handleUpdate = async () => {
    if (quantity <= 0) {
      setMessage('Jumlah stok harus lebih dari 0.');
      return;
    }

    try {
      const token = await getToken();
      const data = { id: stockId, productId, storeId, quantity };
      const { result, ok } = await updateStock(data, token);
      setMessage(
        ok ? 'Stok berhasil diperbarui!' : result?.msg || 'Terjadi kesalahan.',
      );
      if (ok) window.location.reload();
      onClose();
    } catch (error) {
      setMessage('Gagal memperbarui stok.');
    }
  };

  return (
    <>
      {/* Tooltip dengan ikon edit */}
      <Tooltip color="primary" content="Edit stock">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>

      {/* Modal untuk Update Stock */}
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Update Stock
          </ModalHeader>
          <ModalBody>
            {loading ? (
              <p>Loading stock details...</p>
            ) : (
              <>
                <Select
                  label="Select a product"
                  className="max-w-xs"
                  value={productId?.toString()}
                  onChange={(e) => setProductId(Number(e.target.value))}
                >
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Select a store"
                  className="max-w-xs"
                  value={storeId?.toString()}
                  onChange={(e) => setStoreId(Number(e.target.value))}
                >
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </Select>
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
              </>
            )}
            {message && <p className="text-red-500 mt-2">{message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleUpdate} isDisabled={loading}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
