import { getUserAddressess } from '@/lib/address';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { selectUser, userAddress } from '@/redux/selector/userSelector';
import { populatedUserAddress } from '@/redux/slice/userSlice';
import { IAddressList } from '@/type/address';
import { useEffect, useState } from 'react';

export default function useAddressList() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [data, setData] = useState<IAddressList[]>([]);
  const addressList = useAppSelector(userAddress);

  const getData = async () => {
    try {
      const data: IAddressList[] = await getUserAddressess();
      setData(data);
      dispatch(populatedUserAddress(data));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (user.id) {
      getData();
    }
  }, [user.id]);

  return { addressList, getData };
}
