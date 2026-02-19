import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  useDisclosure,
} from '@nextui-org/react';
import {
  removeSelectedCheckout,
  resetCheckout,
  selectedAllItems,
} from '@/redux/slice/checkoutSlice';
import { removedFromCart } from '@/redux/slice/cartSlice';
import { deleteCartItem } from '@/lib/cart';
import { ICartItem } from '@/type/cart';
import ConfirmationModal from '@/features/shared/components/modal/confirmationModal';

export default function SelectorController({
  itemOnStock,
  checkout,
}: {
  itemOnStock: ICartItem[];
  checkout: number[];
}) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();

  const onSelectAll = () => {
    const allItemsId = itemOnStock.map((item) => item.id);
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
    <div className="sticky top-28 z-20 px-2">
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
