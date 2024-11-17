import React from 'react';
import { Tooltip } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { DeleteIcon } from '../icons/deleteIcon';
import { getToken } from '@/lib/server';
import { deleteStoreAdmin } from '@/lib/storeAdmin';
import { IStoreAdminDel } from '@/type/storeAdmin';

const DelStoreAdmin = ({ id, onDeleted }: IStoreAdminDel) => {
  const delStoreAdmin = async (id: number) => {
    try {
      const token = await getToken();
      const { result, ok } = await deleteStoreAdmin({ id }, token);

      if (!ok) throw new Error('Failed to delete Store Admin');

      toast.success('Store Admin deleted successfully');

      await onDeleted();
    } catch (error) {
      toast.error('Failed to delete Store Admin');
      console.error(error);
    }
  };

  return (
    <Tooltip color="danger" content="Delete store admin">
      <span className="text-lg text-danger cursor-pointer active:opacity-50">
        <DeleteIcon onClick={() => delStoreAdmin(id)} />
      </span>
    </Tooltip>
  );
};

export default DelStoreAdmin;
