import currencyRupiah from '@/lib/rupiahCurrency';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spinner,
} from '@nextui-org/react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { postCheckoutItems } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import { ICartItem } from '@/type/cart';
import SelectedItem from './SelectedItem';

type ComponentsProps = {
  subtotal: string;
  isDisabled: boolean;
  isLoading: 'DATA' | 'CHECKOUT' | null;
  onCheckout: () => void;
};

type MainProps = {
  isLoading: 'CHECKOUT' | 'DATA' | null;
  checkout: number[];
  cart: ICartItem[];
  setIsLoading: Dispatch<SetStateAction<'CHECKOUT' | 'DATA' | null>>;
};

export default function CartCheckoutDetails({
  isLoading,
  setIsLoading,
  checkout,
  cart,
}: MainProps) {
  const router = useRouter();
  const subtotal = useMemo(() => {
    return cart
      .filter((item) => checkout.includes(item.id))
      .reduce((total, item) => total + item.quantity * item.product?.price!, 0);
  }, [checkout, cart]);

  const onCheckout = async () => {
    setIsLoading('CHECKOUT');
    const res = await postCheckoutItems(checkout);
    if (!res.ok) {
      setIsLoading(null);
    } else {
      router.push('/cart/checkout');
    }
  };

  const isDisabled = !!isLoading || checkout.length === 0;
  return (
    <>
      <CardDesktopComponents
        isDisabled={isDisabled}
        isLoading={isLoading}
        onCheckout={onCheckout}
        subtotal={currencyRupiah(subtotal)}
      />
      <CardMobileComponets
        isDisabled={isDisabled}
        isLoading={isLoading}
        onCheckout={onCheckout}
        subtotal={currencyRupiah(subtotal)}
      />
    </>
  );
}

function CheckoutButton({
  isDisabled,
  isLoading,
  onClick,
}: {
  isDisabled: boolean;
  isLoading: 'DATA' | 'CHECKOUT' | null;
  onClick: () => void;
}) {
  return (
    <Button
      color="primary"
      size="md"
      isDisabled={isDisabled}
      spinner={<Spinner color="default" />}
      isLoading={isLoading === 'CHECKOUT'}
      onPress={onClick}
    >
      Checkout
    </Button>
  );
}

function CardDesktopComponents({
  isDisabled,
  onCheckout,
  isLoading,
  subtotal,
}: ComponentsProps) {
  return (
    <div className="sticky top-28 hidden md:block">
      <Card className="w-full rounded-none md:rounded-md">
        <CardHeader>
          <h2 className="font-bold text-lg">Checkout Details</h2>
        </CardHeader>
        <CardBody>
          <SelectedItem />
          <Divider className="my-1" />
          <div className="flex font-semibold justify-between">
            <p>Total : </p>
            <p>{subtotal}</p>
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-end">
          <CheckoutButton
            isLoading={isLoading}
            isDisabled={isDisabled}
            onClick={onCheckout}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

function CardMobileComponets({
  onCheckout,
  isDisabled,
  isLoading,
  subtotal,
}: ComponentsProps) {
  return (
    <div className="fixed w-full bottom-0 block md:hidden">
      <Card className="w-full rounded-none md:rounded-md">
        <CardBody>
          <div className="grid grid-cols-2">
            <div className="flex flex-col justify-between">
              <p>Total : </p>
              <p>{subtotal}</p>
            </div>
            <CheckoutButton
              isLoading={isLoading}
              isDisabled={isDisabled}
              onClick={onCheckout}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
