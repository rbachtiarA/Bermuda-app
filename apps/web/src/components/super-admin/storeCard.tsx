import { IStoreList } from '@/type/store';
import { Button, Card, CardBody } from '@nextui-org/react';
import React from 'react';

interface StoreListCardProps {
  store: IStoreList;
  onSelect: () => void;
}

const StoreListCard: React.FC<StoreListCardProps> = ({ store, onSelect }) => {
  return (
    <Card className="flex flex-row items-center justify-between p-4 border-primary border">
      <CardBody className="flex flex-col">
        <p className="font-bold">{store.name}</p>
        <p className="text-sm text-gray-500">{store.location}</p>
        <p>{store.cityId}</p>
      </CardBody>
      <div className='flex flex-row gap-2'>
        <Button color="primary" variant="ghost" onPress={onSelect}>
          Ubah
        </Button>
        <Button color="primary" onPress={onSelect}>
          Hapus
        </Button>
      </div>
    </Card>
  );
};

export default StoreListCard;
