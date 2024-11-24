// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Input,
//   Select,
//   Spinner,
//   SelectItem,
//   Card,
//   Spacer,
// } from '@nextui-org/react';
// import { getToken, getUserId } from '@/lib/server';
// import { getProducts } from '@/lib/product.handler';
// import { getAllStore } from '@/lib/store.handler';
// import { createDiscountBogo } from '@/lib/discount.handler';

// const CreateBuyOneGetOneDiscount: React.FC = () => {
//   const [formData, setFormData] = useState({
//     productId: 0,
//     value: 1,
//     discountType: 'BUY_ONE_GET_ONE',
//     storeId: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [products, setProducts] = useState<any[]>([]);
//   const [stores, setStores] = useState<any[]>([]);
//   const [storeId, setStoreId] = useState<number>(0);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const token = await getToken();
//         const [fetchedProducts, fetchedStores] = await Promise.all([
//           getProducts(),
//           getAllStore(),
//         ]);
//         const userId = await getUserId();
//         const filterStores = fetchedStores.stores
//           .map((x: any) => {
//             return x.users.find((y: any) => y.id === Number(userId)) ? x : null;
//           })
//           .filter((store: any) => store !== null);
//         setStoreId(filterStores[0].id);
//         formData.storeId = filterStores[0].id;
//         console.log(filterStores[0].id);

//         setProducts(fetchedProducts.products);
//         setStores(filterStores);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       }
//     };
//     loadData();
//   }, []);

//   console.log(formData, 'FORM');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const token = await getToken();
//       const { result, ok } = await createDiscountBogo(formData, token);
//       if (ok) {
//         setMessage('Diskon BOGO berhasil dibuat.');
//         setFormData({
//           productId: 0,
//           value: 1,
//           discountType: 'BUY_ONE_GET_ONE',
//           storeId: 0,
//         });
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage('Gagal membuat diskon BOGO. Silakan coba lagi.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
//       <h3>Buat Diskon BOGO</h3>
//       <Spacer y={1} />
//       <form onSubmit={handleSubmit}>
//         <Select
//           isDisabled
//           name="storeId"
//           label="Pilih Toko"
//           value={formData.storeId?.toString() || ''}
//           selectedKeys={[String(storeId)]}
//           onChange={(e) =>
//             setFormData({ ...formData, storeId: parseInt(e.target.value) })
//           }
//           fullWidth
//           required
//         >
//           {stores.map((store) => (
//             <SelectItem key={store.id} value={store.id.toString()}>
//               {store.name}
//             </SelectItem>
//           ))}
//         </Select>
//         <Spacer y={1} />
//         <Select
//           name="productId"
//           label="Pilih Produk"
//           value={formData.productId?.toString() || ''}
//           onChange={(e) =>
//             setFormData({ ...formData, productId: parseInt(e.target.value) })
//           }
//           fullWidth
//           required
//         >
//           {products.map((product) => (
//             <SelectItem key={product.id} value={product.id.toString()}>
//               {product.name}
//             </SelectItem>
//           ))}
//         </Select>
//         <Spacer y={1} />
//         <Input
//           name="value"
//           type="number"
//           label="Nilai Diskon"
//           placeholder="Masukkan nilai diskon"
//           value={formData.value.toString()}
//           onChange={(e) => {}}
//           fullWidth
//           required
//           disabled
//         />
//         <Spacer y={1} />
//         <Input
//           name="discountType"
//           type="string"
//           label="Type Discount"
//           placeholder="Masukkan nilai diskon"
//           value={formData.discountType}
//           onChange={(e) => {}}
//           fullWidth
//           required
//           disabled
//         />
//         <Spacer y={1} />

//         <Button type="submit" color="primary" fullWidth disabled={loading}>
//           {loading ? <Spinner /> : 'Buat Diskon'}
//         </Button>
//       </form>
//       <Spacer y={1} />
//       {message && (
//         <p style={{ color: message.includes('berhasil') ? 'green' : 'red' }}>
//           {message}
//         </p>
//       )}
//     </Card>
//   );
// };

// export default CreateBuyOneGetOneDiscount;

import React, { useState, useEffect } from 'react';
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
} from '@nextui-org/react';
import { PlusIcon } from '../icons/plusIcon';
import { getToken, getUserId } from '@/lib/server';
import { getProducts } from '@/lib/product.handler';
import { getAllStore } from '@/lib/store.handler';
import { createDiscountBogo } from '@/lib/discount.handler';

const CreateBuyOneGetOneDiscount: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: 0,
    value: 1,
    discountType: 'BUY_ONE_GET_ONE',
    storeId: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setFormData({
      productId: 0,
      value: 1,
      discountType: 'BUY_ONE_GET_ONE',
      storeId: 0,
    });
    setMessage('');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        const [fetchedProducts, fetchedStores] = await Promise.all([
          getProducts(),
          getAllStore(),
        ]);
        const userId = await getUserId();
        const filterStores = fetchedStores.stores
          .map((x: any) => {
            return x.users.find((y: any) => y.id === Number(userId)) ? x : null;
          })
          .filter((store: any) => store !== null);

        if (filterStores.length > 0) {
          const defaultStoreId = filterStores[0].id;
          setFormData((prev) => ({ ...prev, storeId: defaultStoreId }));
        }

        setProducts(fetchedProducts.products);
        setStores(filterStores);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = await getToken();
      const { result, ok } = await createDiscountBogo(formData, token);

      if (ok) {
        setMessage('Diskon BOGO berhasil dibuat.');
        onClose();
      } else {
        setMessage(result?.msg || 'Gagal membuat diskon BOGO.');
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        endContent={<PlusIcon />}
        size="sm"
      >
        Create BOGO Discount
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Create Buy One Get One Discount
          </ModalHeader>
          <ModalBody>
            <Select
              label="Select Store"
              className="max-w-xs"
              value={formData.storeId?.toString()}
              onChange={(e) =>
                setFormData({ ...formData, storeId: parseInt(e.target.value) })
              }
            >
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Select Product"
              className="max-w-xs"
              value={formData.productId?.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productId: parseInt(e.target.value),
                })
              }
            >
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              isDisabled
              label="Discount Type"
              value={formData.discountType}
              className="max-w-xs"
            />
            <Input
              isDisabled
              label="Discount Value"
              value={formData.value.toString()}
              className="max-w-xs"
            />
            {message && (
              <p
                className={`mt-2 ${
                  message.includes('berhasil')
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {message}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleCreate} isDisabled={loading}>
              {loading ? 'Loading...' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBuyOneGetOneDiscount;
