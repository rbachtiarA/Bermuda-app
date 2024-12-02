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
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
  const [stockH, setStockH] = useState<
    { id: number; quantity: number; changeType: string }[]
  >([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const [message, setMessage] = useState('');
  const [productId, setProductId] = useState(0);
  const [storeId, setStoreId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

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
        setStockH(data.stockHistory);
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
    await fetchStockDetails();
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

  const selectedProduct = products.find((product) => product.id === productId);
  const selectedStore = stores.find((store) => store.id === storeId);

  return (
    <>
      <Tooltip color="primary" content="Edit stock">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Update Stock
          </ModalHeader>
          <ModalBody>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Store Name
            </label>
            <Select
              label={selectedStore ? selectedStore.name : 'Select a store'}
              className="max-w-xs"
              isDisabled
              value={storeId?.toString()}
              onChange={(e) => setStoreId(Number(e.target.value))}
            >
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </Select>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <Select
              label={selectedProduct ? selectedProduct.name : 'Select Product'}
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
                min={1}
                required
              />
            </div>

            {message && <p className="text-red-500 mt-2">{message}</p>}
            {stockH && (
              <div className="w-full max-w-4xl">
                <Card style={{ padding: '20px' }}>
                  {/* <h3>Stock History for ID: {setStockH?.stock[0].id}</h3> */}
                  <Table
                    aria-label="Stock History Table"
                    style={{ marginTop: '20px' }}
                    shadow="none"
                  >
                    <TableHeader>
                      <TableColumn>ID</TableColumn>
                      <TableColumn>Quantity</TableColumn>
                      <TableColumn>Change Type</TableColumn>
                      <TableColumn>Date</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {stockH?.map((history: any, idx: number) => (
                        <TableRow key={idx + 1}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{history.quantity}</TableCell>
                          <TableCell>{history.changeType}</TableCell>
                          <TableCell>
                            {new Date(history.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
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
