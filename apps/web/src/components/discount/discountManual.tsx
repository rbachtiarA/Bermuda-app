import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Select,
  Card,
  Spacer,
  SelectItem,
} from '@nextui-org/react';
import { createDiscount } from '@/lib/discount.handler';
import { getToken, getUserId } from '@/lib/server';
import { getProducts } from '@/lib/product.handler';
import { getAllStore } from '@/lib/store.handler';

const CreateManualDiscount: React.FC = () => {
  const [formData, setFormData] = useState({
    productId: 0,
    value: 0,
    discountType: '',
    storeId: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        const userId = await getUserId();
        const [fetchedProducts, fetchedStores] = await Promise.all([
          getProducts(),
          getAllStore(),
        ]);
        const filterStores = fetchedStores.stores
          .map((x: any) => {
            return x.users.find((y: any) => y.id === Number(userId)) ? x : null;
          })
          .filter((store: any) => store !== null);
        setStoreId(filterStores[0].id);
        // formData.storeId = storeId;

        setProducts(fetchedProducts.products);
        setStores(filterStores);
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
      const { result, ok } = await createDiscount(
        { ...formData, storeId },
        token,
      );
      if (ok) {
        setMessage('Diskon manual berhasil dibuat.');
        setFormData({
          productId: 0,
          value: 0,
          discountType: 'PERCENTAGE',
          storeId: 0,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      setMessage('Gagal membuat diskon manual. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h3>Buat Diskon Manual</h3>
      <Spacer y={1} />
      <form onSubmit={handleSubmit}>
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
          name="productId"
          label="Pilih Produk"
          value={formData.productId?.toString() || ''}
          onChange={(e) =>
            setFormData({ ...formData, productId: parseInt(e.target.value) })
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
          name="value"
          type="number"
          label="Nilai Diskon"
          placeholder="Masukkan nilai diskon"
          value={formData.value !== null ? formData.value.toString() : ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              value: e.target.value ? parseFloat(e.target.value) : 0,
            })
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
        <Spacer y={1} />

        <Button type="submit" color="primary" fullWidth disabled={loading}>
          {loading ? 'Loading...' : 'Buat Diskon'}
        </Button>
      </form>
      <Spacer y={1} />
      {message && (
        <p style={{ color: message.includes('berhasil') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </Card>
  );
};

export default CreateManualDiscount;

// import React, { useEffect, useState } from 'react';
// import {
//   Input,
//   Button,
//   Select,
//   SelectItem,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from '@nextui-org/react';
// import { createDiscount } from '@/lib/discount.handler';
// import { getToken, getUserId } from '@/lib/server';
// import { getProducts } from '@/lib/product.handler';
// import { getAllStore } from '@/lib/store.handler';
// import { PlusIcon } from '../icons/plusIcon';

// const CreateManualDiscount: React.FC = () => {
//   const [formData, setFormData] = useState({
//     productId: 0,
//     value: 0,
//     discountType: '',
//     storeId: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [products, setProducts] = useState<any[]>([]);
//   const [stores, setStores] = useState<any[]>([]);
//   const [storeId, setStoreId] = useState<number>(0);
//   const [productId, setProductId] = useState<number>(0);

//   const onOpen = () => setIsOpen(true);
//   const onClose = () => {
//     setIsOpen(false);
//     setProductId(0);
//     setStoreId(0);
//     setMessage('');
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const token = await getToken();
//         const userId = await getUserId();
//         const [fetchedProducts, fetchedStores] = await Promise.all([
//           getProducts(),
//           getAllStore(),
//         ]);
//         const filterStores = fetchedStores.stores
//           .map((x: any) => {
//             return x.users.find((y: any) => y.id === Number(userId)) ? x : null;
//           })
//           .filter((store: any) => store !== null);
//         setStoreId(filterStores[0].id);
//         // formData.storeId = storeId;

//         setProducts(fetchedProducts.products);
//         setStores(filterStores);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       }
//     };
//     loadData();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const token = await getToken();
//       const { result, ok } = await createDiscount(
//         { ...formData, storeId },
//         token,
//       );
//       if (ok) {
//         setMessage('Diskon manual berhasil dibuat.');
//         setFormData({
//           productId: 0,
//           value: 0,
//           discountType: 'PERCENTAGE',
//           storeId: 0,
//         });
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage('Gagal membuat diskon manual. Silakan coba lagi.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button
//         onPress={onOpen}
//         variant="flat"
//         endContent={<PlusIcon />}
//         size="sm"
//       >
//         Add New
//       </Button>
//       <Modal isOpen={isOpen} placement="top-center">
//         <ModalContent>
//           <ModalHeader className="flex flex-col gap-1">
//             Create Manual Discount
//           </ModalHeader>
//           <ModalBody>
//             <Select
//               name="storeId"
//               isDisabled
//               label="Pilih Toko"
//               value={formData.storeId?.toString() || ''}
//               selectedKeys={[String(storeId)]}
//               onChange={(e) =>
//                 setFormData({ ...formData, storeId: parseInt(e.target.value) })
//               }
//               fullWidth
//               required
//             >
//               {stores?.map((store) => (
//                 <SelectItem key={store.id} value={store.id.toString()}>
//                   {store.name}
//                 </SelectItem>
//               ))}
//             </Select>
//             <Select
//               name="productId"
//               label="Pilih Produk"
//               value={formData.productId?.toString() || ''}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   productId: parseInt(e.target.value),
//                 })
//               }
//               fullWidth
//               required
//             >
//               {products.map((product) => (
//                 <SelectItem key={product.id} value={product.id.toString()}>
//                   {product.name}
//                 </SelectItem>
//               ))}
//             </Select>
//             <Input
//               name="value"
//               type="number"
//               label="Nilai Diskon"
//               placeholder="Masukkan nilai diskon"
//               value={formData.value !== null ? formData.value.toString() : ''}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   value: e.target.value ? parseFloat(e.target.value) : 0,
//                 })
//               }
//               fullWidth
//               required
//             />
//             <Select
//               label="Tipe Diskon"
//               value={formData.discountType}
//               onChange={(e) =>
//                 setFormData({ ...formData, discountType: e.target.value })
//               }
//               fullWidth
//               required
//             >
//               <SelectItem key="FLAT" value="FLAT">
//                 Nominal
//               </SelectItem>
//               <SelectItem key="PERCENTAGE" value="PERCENTAGE">
//                 Persentase
//               </SelectItem>
//             </Select>

//             {message && (
//               <p
//                 style={{
//                   color: message.includes('berhasil') ? 'green' : 'red',
//                 }}
//               >
//                 {message}
//               </p>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button color="danger" variant="flat" onPress={onClose}>
//               Close
//             </Button>
//             <Button color="primary" onSubmit={handleSubmit}>
//               Create
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default CreateManualDiscount;
