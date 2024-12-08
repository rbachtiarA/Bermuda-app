'use client';
import { useEffect, useMemo, useState } from 'react';
import AddressessList from './addressList';
import CheckoutList from './checkoutList';
import PaymentTotalList from './paymentList';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { IAddress } from '@/type/address';
import {
  postOrder,
} from '@/lib/order.handler';
import { useRouter } from 'next/navigation';
import { resetCheckout } from '@/redux/slice/checkoutSlice';
import { IDiscount } from '@/type/discount';
import { getShippingCost } from '@/lib/address';
import { getNearestStore } from '@/lib/store.handler';
import { updateStore } from '@/redux/slice/storeSlice';
import { toast } from 'react-toastify';
import StoreCheckoutDetails from './storeCheckoutDetails';
import { selectAddress } from '@/redux/slice/userSlice';
import { IUserState } from '@/type/user';

export default function CheckoutWrapper() {
  const user = useAppSelector((state) => state.user);
  const store = useAppSelector((state) => state.store);
  const dispatch = useAppDispatch();
  const [itemTotalPayment, setItemTotalPayment] = useState<number>(0);
  const [discount, setDiscount] = useState<IDiscount | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [methodPayment, setMethodPayment] = useState<
    'Transfer' | 'Gateway' | null
  >(null);
  const [selectedAddress, setselectedAddress] = useState<IAddress | null>(
    user.selectedAddress as IAddress,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const router = useRouter();
  const discountCut = useMemo(() => {
    if (!!discount) {
      switch (discount.discountType) {
        case 'FLAT':
          return discount.value;
        case 'PERCENTAGE':
          //if value based on 100/100
          return itemTotalPayment! * (discount.value / 100);
        case 'REFERRAL_GIVER':
          return discount.value;
        case 'REFERRAL_USER':
          return discount.value;
        default:
          return 0;
      }
    } else {
      return 0;
    }
  }, [itemTotalPayment, discount]);

  const onBuy = async () => {
    setIsLoading(true);
    
    const { status, msg } = await postOrder(
      itemTotalPayment! + shippingCost! - discountCut!,
      shippingCost!,
      selectedAddress?.id!,
      store.id!,
      discountCut,
      methodPayment!,
      discount?.id,
    );

    if (status === 'error') {
      if (msg.details) {
        setIsError(msg.details);
      }
    }

    if (status === 'ok' && methodPayment === 'Gateway') {
      window.open(
        `https://app.sandbox.midtrans.com/snap/v4/redirection/${msg}`,
        '_blank',
        'noopener,noreferrer',
      );
    }
    if (status === 'ok') router.push('/account/payment');
    
    //update checkoutItem user to null using api
    dispatch(resetCheckout());
    setIsLoading(false);
  };

  const onDiscount = (discount: IDiscount | null) => {
    setDiscount(discount);
  };

  const updateSelectedAddress = (address: IAddress | undefined) => {
    if (address !== undefined) {
      setselectedAddress(address);
      dispatch(selectAddress(address as IUserState['selectedAddress']));
    }
  };

  const updateItemTotalPayment = (totalPayment: number) => {
    setItemTotalPayment(totalPayment);
  };

  const updateMethodPayment = (methodPayment: string) => {
    if (methodPayment === 'Transfer' || methodPayment === 'Gateway') {
      setMethodPayment(methodPayment);
    } else {
      setMethodPayment(null);
    }
  };

  useEffect(() => {
    const getDataShippingCost = async () => {
      setShippingCost(null);
      if (selectedAddress) {
        const { status, msg } = await getShippingCost(
          selectedAddress?.id,
          store.id,
        );
        if (status === 'ok') setShippingCost(msg);
      }
    };

    const getNearStore = async () => {
      if (selectedAddress) {
        const { status, msg, distance } = await getNearestStore(
          selectedAddress.latitude!,
          selectedAddress.longitude!,
        );

        if (status === 'ok' && msg.id !== store.id) {
          dispatch(updateStore({ id: msg.id, name: msg.name, distance }));
          toast.info(`change store to ${msg.name}, cause of address change`, {
            autoClose: 4000,
            style: { fontSize: '14px' },
          });
          setDiscount(null);
        }
      }
    };
    getNearStore();
    getDataShippingCost();
  }, [selectedAddress]);

  const isPaymentInvalid = useMemo(() => {
    return (
      !store.inRange ||
      !shippingCost ||
      !itemTotalPayment ||
      !methodPayment ||
      !selectedAddress ||
      !!isError
    );
  }, [
    shippingCost,
    itemTotalPayment,
    methodPayment,
    selectAddress,
    store.inRange,
    isError,
  ]);

  return (
    <div className="grid md:grid-cols-[2fr_1fr] md:w-auto gap-2 w-full p-2">
      <div className="grid gap-2">
        <StoreCheckoutDetails storeName={store.name} inRange={store.inRange} />
        <AddressessList
          selectedAddress={selectedAddress}
          updateSelectedAddress={updateSelectedAddress}
        />
        <CheckoutList updateItemTotalPayment={updateItemTotalPayment} />
      </div>
      <div>
        <PaymentTotalList
          discount={discount}
          discountCut={discountCut}
          isError={isError}
          itemTotalPayment={itemTotalPayment}
          travelPayment={shippingCost}
          isPaymentInvalid={isPaymentInvalid}
          methodPayment={methodPayment}
          isLoading={isLoading}
          updateMethodPayment={updateMethodPayment}
          onBuy={onBuy}
          onDiscount={onDiscount}
        />
      </div>
    </div>
  );
}
