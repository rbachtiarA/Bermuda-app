'use client';
import { getStoreStock } from '@/lib/store.handler';
import { useAppSelector } from '@/redux/hook';
import { IStocks } from '@/type/product';
import { useEffect, useState } from 'react';

export default function useProductList() {
  const store = useAppSelector((state) => state.store);
  const [data, setData] = useState<IStocks[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    const res = await getStoreStock(store.id);
    if (res) {
      setData([...res]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (store.id !== 0) {
      getData();
    }
  }, [store]);

  return {
    store,
    data,
    isLoading,
  };
}
