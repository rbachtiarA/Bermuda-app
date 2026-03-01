import ConfirmationModal from '@/features/shared/components/modal/confirmationModal';
import { deleteCartItem } from '@/lib/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { checkoutArr } from '@/redux/selector/checkoutSelector';
import { removedFromCart } from '@/redux/slice/cartSlice';
import {
  removeSelectedCheckout,
  resetCheckout,
  selectedAllItems,
} from '@/redux/slice/checkoutSlice';
import { ICartItem } from '@/type/cart';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  useDisclosure,
} from '@nextui-org/react';

export default function SelectorController({
  itemOnStock,
}: {
  itemOnStock: ICartItem[];
}) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();
  const checkout = useAppSelector(checkoutArr);

  const onSelectAll = () => {
    const allItemsId = itemOnStock.map((item) => item.productId);
    if (checkout.length === itemOnStock.length) {
      dispatch(resetCheckout());
    } else {
      dispatch(selectedAllItems(allItemsId));
    }
  };

  const deleteMultipleItemCart = async () => {
    const { data } = await deleteCartItem(checkout);
    dispatch(removedFromCart(data));
    dispatch(removeSelectedCheckout(data));
  };

  return (
    <div className="flex py-2 md:grid md:grid-flow-col md:grid-cols-[50px_2fr_100px_80px_145px] w-full items-center font-semibold gap-2">
      <div className="flex size-full max-w-[50px] items-center justify-center">
        <Checkbox
          size="sm"
          onValueChange={onSelectAll}
          isIndeterminate={
            checkout.length > 0 && checkout.length !== itemOnStock.length
          }
          isSelected={
            itemOnStock.length !== 0 && itemOnStock.length === checkout.length
          }
        />
      </div>
      <span className="hidden md:inline">Produk</span>
      <span className="hidden md:inline">Harga</span>
      <span className="hidden md:inline">Jumlah</span>
      <span className="hidden md:inline">Total</span>
      <span className="inline text-xl md:hidden">Keranjang</span>
      {/* {checkout.length !== 0 && (
        <div>
          <Button
            color="danger"
            variant="light"
            size="sm"
            className="max-h-6"
            onPress={onOpen}
          >
            Hapus
          </Button>
          <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={deleteMultipleItemCart}
            title="Remove selected item from cart"
            content={`Are you sure want to remove selected item from your cart ?`}
          />
        </div>
      )} */}
    </div>
  );
  return (
    <div className="sticky top-28 z-[5] px-2">
      <Card>
        <CardBody>
          <div className="flex justify-between">
            <Checkbox
              onValueChange={onSelectAll}
              isIndeterminate={
                checkout.length > 0 && checkout.length !== itemOnStock.length
              }
              isSelected={
                itemOnStock.length !== 0 &&
                itemOnStock.length === checkout.length
              }
            >
              Semua
            </Checkbox>
            {checkout.length !== 0 && (
              <>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  className="max-h-6"
                  onPress={onOpen}
                >
                  Hapus
                </Button>
                <ConfirmationModal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  onConfirm={deleteMultipleItemCart}
                  title="Remove selected item from cart"
                  content={`Are you sure want to remove selected item from your cart ?`}
                />
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
