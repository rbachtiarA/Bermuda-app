import { postCheckoutItems } from '@/lib/cart';
import currencyRupiah from '@/lib/rupiahCurrency';
import { useAppSelector } from '@/redux/hook';
import {
  isCheckoutUpdating,
  selectCartItems,
} from '@/redux/selector/cartSelector';
import { checkoutArr } from '@/redux/selector/checkoutSelector';
import { ICartItem } from '@/type/cart';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spinner,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useMemo } from 'react';

type ComponentsProps = {
  subtotal: string;
  isDisabled: boolean;
  isLoading: 'DATA' | 'CHECKOUT' | null;
  onCheckout: () => void;
};

type MainProps = {
  cart: ICartItem[];
  isLoading: 'CHECKOUT' | 'DATA' | null;
  setIsLoading: Dispatch<SetStateAction<'CHECKOUT' | 'DATA' | null>>;
};

export default function CartCheckoutDetails({
  cart,
  isLoading,
  setIsLoading,
}: MainProps) {
  const router = useRouter();
  const isUpdating = useAppSelector(isCheckoutUpdating);
  const checkout = useAppSelector(checkoutArr);
  const cartArr = useAppSelector(selectCartItems);

  const subtotal = useMemo(() => {
    return cart
      .filter((item) => checkout.includes(item.productId))
      .reduce(
        (total, item) =>
          total + cartArr[item.productId].quantity * item.product!.price,
        0,
      );
  }, [checkout, cartArr]);

  const onCheckout = async () => {
    setIsLoading('CHECKOUT');
    const res = await postCheckoutItems(checkout);
    if (!res.ok) {
      setIsLoading(null);
    } else {
      router.push('/cart/checkout');
    }
  };

  const isDisabled = !!isLoading || isUpdating || checkout.length === 0;
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
    <div className="sticky top-28 hidden md:block z-[5]">
      <Card className="w-full rounded-none md:rounded-md">
        <CardHeader>
          <h2 className="font-bold text-lg">Checkout Details</h2>
        </CardHeader>
        <CardBody>
          {/* <SelectedItem /> */}
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
    <div className="fixed w-full bottom-0 block md:hidden z-[5]">
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
