
"use client"
import { getAllStores } from '@/lib/superAdmin.handler';
import {
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import StoreListCard from './storeCard';
import { IStoreList } from '@/type/store';
import { NewStoreForm } from './newStoreForm';


export const StoreListData: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [storeData, setStoreData] = useState<IStoreList[]>([]);

    const fetchStores = async () => {
      try {
        const response = await getAllStores();
        setStoreData(response.data || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    useEffect(() => {
    
        fetchStores();
      }, []);

  return (
    <div>
      <div className="flex flex-col overflow-auto gap-5">
        <div className='flex flex-col gap-2 overflow-auto'>
          {storeData && storeData.length > 0 ? (
            storeData.map((store, index) => (
              <StoreListCard key={index} store={store} onSelect={() => console.log(`Store selected: ${store.name}`)} />
            ))
          ) : (
            <p>Tidak ada data toko, silahkan buat data toko baru</p>
          )}
        </div>
        <div className="flex justify-center">
        <Button fullWidth color="primary" onPress={onOpen}>
            Buat Toko Baru
          </Button>
        </div>
      </div>

      <NewStoreForm isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            fetchStores(); 
          }
          open ? onOpen() : onClose(); 
        }} />
    </div>
  );
};
