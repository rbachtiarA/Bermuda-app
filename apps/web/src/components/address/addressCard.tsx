import { AddressCardProps, IAddressList } from '@/type/address';
import { Button, Card, CardBody } from '@nextui-org/react';
import { ReactNode, useState } from 'react';
import EditAddress from './editAddress';
import DeleteAddress from './deleteAddress';
import { NewAddressModal } from './newAddressModal';
import { EditAddressModal } from './editAddressModal';

export default function AddressCard({
  address,
  onSelect,
  onDeleteSuccess,
}: AddressCardProps & { onDeleteSuccess: () => void }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<IAddressList | null>(null);
  const handleEdit = () => {
    setEditData(address);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Card className="flex flex-row items-center justify-between border-primary border">
        <CardBody className="flex flex-col">
          <p className="text-sm text-gray-500">{address.label}</p>
          <p className="font-bold">{address.recipient}</p>
          <p>{address.phoneNumber}</p>
          <p>{address.addressLine}</p>
        </CardBody>
        <div className="flex flex-col px-2 gap-3 h-full">
          <Button color="primary" size="sm" variant="ghost" onClick={onSelect}>
            Pilih
          </Button>
          <div className="flex justify-between">
            <EditAddress onEdit={handleEdit}/>
            <DeleteAddress
              addressId={address.id}
              onDeleteSuccess={onDeleteSuccess}
            />
          </div>
        </div>
      </Card>
      <EditAddressModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} initialData={editData} onSubmitSuccess={onDeleteSuccess}></EditAddressModal>
    </>
  );
}
