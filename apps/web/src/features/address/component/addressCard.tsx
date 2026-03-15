import { useAppDispatch } from '@/redux/hook';
import { selectAddress } from '@/redux/slice/userSlice';
import { IAddressList } from '@/type/address';
import { Button, Card, CardBody } from '@nextui-org/react';
import DeleteAddress from './modal/deleteAddress';
import EditAddress from './modal/editAddress';

type AddressCardProps = {
  address: IAddressList;
  onClose: () => void;
  onEdit: (address: IAddressList) => void;
  onRemove: (address: IAddressList) => void;
};

export default function AddressCard({
  address,
  onClose,
  onEdit,
  onRemove,
}: AddressCardProps) {
  const dispatch = useAppDispatch();

  const handleSelectedAddress = () => {
    dispatch(selectAddress(address));
    onClose();
  };

  const formatAddress = `${address.addressLine}, ${address.city}, ${address.state}, ${address.postalCode}`;
  return (
    <Card className="flex flex-row items-center justify-between border-primary border shrink-0">
      <CardBody className="flex flex-col">
        <p className="text-sm text-gray-500">{address.label}</p>
        <p className="font-bold">{address.recipient}</p>
        <p>{address.phoneNumber}</p>
        <p>{formatAddress}</p>
      </CardBody>

      <div className="flex flex-col px-2 gap-3">
        <Button
          color="primary"
          size="sm"
          variant="ghost"
          onClick={handleSelectedAddress}
        >
          Pilih
        </Button>

        <div className="flex justify-around">
          <EditAddress onEdit={() => onEdit(address)} />
          <DeleteAddress onOpen={() => onRemove(address)} />
        </div>
      </div>
    </Card>
  );
}
