'use client';
import { DeleteIcon } from '@/components/icons/deleteIcon';
import { Tooltip } from '@nextui-org/react';

interface DeleteAddressProps {
  onOpen: () => void;
}
export default function DeleteAddress({ onOpen }: DeleteAddressProps) {
  return (
    <>
      <Tooltip color="danger" content="Hapus Alamat">
        <div className="text-lg  cursor-pointer active:opacity-50">
          <DeleteIcon onClick={onOpen} />
        </div>
      </Tooltip>
    </>
  );
}
