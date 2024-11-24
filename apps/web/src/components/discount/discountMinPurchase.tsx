// import { useEffect, useState } from 'react';
// import { Button, Input, Select, SelectItem, Spacer } from '@nextui-org/react';
// import { getToken, getUserId } from '@/lib/server';
// import { getAllStore } from '@/lib/store.handler';
// import { createDiscountMinPur } from '@/lib/discount.handler';

// const CreateDiscountMInPurchase: React.FC = () => {
//   const [minPurchase, setMinPurchase] = useState<string>('');
//   const [value, setValue] = useState<string>('');
//   const [discountType, setDiscountType] = useState<string>('');
//   const [storeId, setStoreId] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>('');
//   const [stores, setStores] = useState<any[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const token = await getToken();
//         const [fetchedStores] = await Promise.all([getAllStore()]);
//         const userId = await getUserId();

//         const filterStores = fetchedStores.stores
//           .map((x: any) => {
//             return x.users.find((y: any) => y.id === Number(userId)) ? x : null;
//           })
//           .filter((store: any) => store !== null);
//         setStoreId(filterStores[0].id);
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
//       const { result, ok } = await createDiscountMinPur(
//         {
//           discountType: discountType,
//           minPurchase: Number(minPurchase),
//           storeId: storeId,
//           value: Number(value),
//         },
//         token,
//       );
//       if (ok) {
//         setMessage('Diskon manual berhasil dibuat.');
//         setStoreId(0);
//         setValue('');
//         setStores([]);
//         setDiscountType('');
//         setMinPurchase('');
//         window.location.reload();
//       }

//       // const data = await response.json();
//       // if (response.ok) {
//       //   setMessage('Diskon bersyarat berhasil dibuat!');
//       // } else {
//       //   setMessage(data.error || 'Terjadi kesalahan.');
//       // }
//     } catch (error) {
//       console.error(error);
//       setMessage('Gagal membuat diskon.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
//       <h3>Buat Diskon Bersyarat</h3>
//       <Select
//         isDisabled
//         name="storeId"
//         label="Pilih Toko"
//         value={storeId?.toString() || ''}
//         selectedKeys={[String(storeId)]}
//         onChange={(e) => setStoreId(parseInt(e.target.value))}
//         fullWidth
//         required
//       >
//         {stores.map((store) => (
//           <SelectItem key={store.id} value={store.id.toString()}>
//             {store.name}
//           </SelectItem>
//         ))}
//       </Select>
//       <Spacer y={1} />
//       <Spacer y={1} />
//       <Input
//         type="number"
//         label="Minimal Pembelian"
//         placeholder="Masukkan minimal pembelian"
//         value={minPurchase}
//         onChange={(e) => setMinPurchase(e.target.value)}
//         required
//       />
//       <Spacer y={1} />
//       <Input
//         type="number"
//         label="Nilai Diskon"
//         placeholder="Masukkan nilai diskon"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         required
//       />
//       <Spacer y={1} />
//       <Select
//         label="Tipe Diskon"
//         value={discountType}
//         onChange={(e) => setDiscountType(e.target.value)}
//         fullWidth
//         required
//       >
//         <SelectItem key="FLAT" value="FLAT">
//           Nominal
//         </SelectItem>
//         <SelectItem key="PERCENTAGE" value="PERCENTAGE">
//           Persentase
//         </SelectItem>
//       </Select>

//       <Button type="submit" disabled={loading}>
//         {loading ? 'Mengirim...' : 'Buat Diskon'}
//       </Button>
//       <Spacer y={1} />
//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// export default CreateDiscountMInPurchase;

import { useEffect, useState } from 'react';
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
import { getAllStore } from '@/lib/store.handler';
import { createDiscountMinPur } from '@/lib/discount.handler';

const CreateDiscountMinPurchase: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPurchase, setMinPurchase] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [discountType, setDiscountType] = useState<string>('');
  const [storeId, setStoreId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [stores, setStores] = useState<any[]>([]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setMinPurchase('');
    setValue('');
    setDiscountType('');
    setStoreId(0);
    setMessage('');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        const [fetchedStores] = await Promise.all([getAllStore()]);
        const userId = await getUserId();

        const filterStores = fetchedStores.stores
          .map((store: any) => {
            return store.users.find((user: any) => user.id === Number(userId))
              ? store
              : null;
          })
          .filter((store: any) => store !== null);
        setStoreId(filterStores[0]?.id || 0);
        setStores(filterStores);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = await getToken();
      const { ok } = await createDiscountMinPur(
        {
          discountType,
          minPurchase: Number(minPurchase),
          storeId,
          value: Number(value),
        },
        token,
      );
      if (ok) {
        setMessage('Diskon bersyarat berhasil dibuat!');
        window.location.reload();
      } else {
        setMessage('Gagal membuat diskon.');
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
        endContent={<PlusIcon />}
        size="sm"
      >
        Create Min Purchase Discount
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Buat Diskon Bersyarat
          </ModalHeader>
          <ModalBody>
            <Select
              label="Select Store"
              value={storeId.toString()}
              onChange={(e) => setStoreId(Number(e.target.value))}
              className="max-w-xs"
              disabled
              required
            >
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              type="number"
              label="Min Purchase"
              placeholder="Masukkan minimal pembelian"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              className="mt-4"
              required
            />
            <Input
              type="number"
              label="Nilai Diskon"
              placeholder="Masukkan nilai diskon"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-4"
              required
            />
            <Select
              label="Tipe Diskon"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="max-w-xs mt-4"
              required
            >
              <SelectItem key="FLAT" value="FLAT">
                Nominal
              </SelectItem>
              <SelectItem key="PERCENTAGE" value="PERCENTAGE">
                Persentase
              </SelectItem>
            </Select>
            {message && <p className="text-red-500 mt-2">{message}</p>}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button color="primary" onPress={handleSubmit} disabled={loading}>
              {loading ? 'Mengirim...' : 'Buat Diskon'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateDiscountMinPurchase;
