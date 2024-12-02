import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { getToken, getUserId } from '@/lib/server';
import { getAllStore } from '@/lib/store.handler';
import { createDiscountMinPur } from '@/lib/discount.handler';
import { getProducts } from '@/lib/product.handler';
import { PlusIcon } from '../icons/plusIcon';

const CreateDiscountMinPurchase: React.FC = () => {
  const [formData, setFormData] = useState({
    minPurchase: '',
    value: '',
    discountType: '',
    storeId: 0,
    productId: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [stores, setStores] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setMessage('');
    setFormData({
      minPurchase: '',
      value: '',
      discountType: '',
      storeId: 0,
      productId: 0,
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        const userId = await getUserId();
        const [fetchedStores, fetchedProducts] = await Promise.all([
          getAllStore(),
          getProducts(),
        ]);
        const filterStores = fetchedStores.stores
          .map((x: any) => {
            return x.users.find((y: any) => y.id === Number(userId)) ? x : null;
          })
          .filter((store: any) => store !== null);
        setFormData({
          ...formData,
          storeId: filterStores[0]?.id || 0,
        });
        setStoreId(filterStores[0].id);
        setStores(filterStores);
        setProducts(fetchedProducts?.products);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = await getToken();
      const { ok } = await createDiscountMinPur(
        {
          discountType: formData.discountType,
          minPurchase: Number(formData.minPurchase),
          storeId: formData.storeId,
          value: Number(formData.value),
        },
        token,
      );

      if (ok) {
        setMessage('Diskon berhasil dibuat.');
        setFormData({
          minPurchase: '',
          value: '',
          discountType: '',
          storeId: 0,
          productId: 0,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      setMessage('Gagal membuat diskon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        size="sm"
        endContent={<PlusIcon />}
      >
        Tambah Diskon Min Purchase
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Buat Diskon Bersyarat</ModalHeader>
          <ModalBody>
            <Select
              name="storeId"
              isDisabled
              label="Pilih Toko"
              value={formData.storeId?.toString() || ''}
              selectedKeys={[String(storeId)]}
              onChange={(e) =>
                setFormData({ ...formData, storeId: parseInt(e.target.value) })
              }
              fullWidth
              required
            >
              {stores?.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </Select>
            <Spacer y={1} />
            <Select
              label="Pilih Produk"
              value={formData.productId.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productId: parseInt(e.target.value),
                })
              }
              fullWidth
              required
            >
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </Select>
            <Spacer y={1} />
            <Input
              label="Minimal Pembelian"
              type="number"
              placeholder="Masukkan minimal pembelian"
              value={formData.minPurchase}
              onChange={(e) =>
                setFormData({ ...formData, minPurchase: e.target.value })
              }
              fullWidth
              required
            />
            <Spacer y={1} />
            <Input
              label="Nilai Diskon"
              type="number"
              placeholder="Masukkan nilai diskon"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              fullWidth
              required
            />
            <Spacer y={1} />
            <Select
              label="Tipe Diskon"
              value={formData.discountType}
              onChange={(e) =>
                setFormData({ ...formData, discountType: e.target.value })
              }
              fullWidth
              required
            >
              <SelectItem key="FLAT" value="FLAT">
                Nominal
              </SelectItem>
              <SelectItem key="PERCENTAGE" value="PERCENTAGE">
                Persentase
              </SelectItem>
            </Select>
            {message && (
              <p
                style={{
                  color: message.includes('berhasil') ? 'green' : 'red',
                }}
              >
                {message}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={onClose}
              disabled={loading}
            >
              Tutup
            </Button>
            <Button color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Loading...' : 'Buat Diskon'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateDiscountMinPurchase;
