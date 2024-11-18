import React from 'react';
import { Tooltip } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { DeleteIcon } from '../icons/deleteIcon';
import { getToken } from '@/lib/server';
import { ICategoryDel } from '@/type/category';
import { deleteCategory } from '@/lib/category.handler';
import { deleteStock } from '@/lib/stock.handler';
import { IStockDel } from '@/type/stock';

const DelStock = ({ id, onDeleted }: IStockDel) => {
  const delStock = async (id: number) => {
    try {
      const token = await getToken();
      const { result, ok } = await deleteStock({ id }, token);

      if (!ok) throw new Error('Failed to delete Category');

      toast.success('Category deleted successfully');

      await onDeleted();
    } catch (error) {
      toast.error('Failed to delete Category');
      console.error(error);
    }
  };

  return (
    <Tooltip color="danger" content="Delete category">
      <span className="text-lg text-danger cursor-pointer active:opacity-50">
        <DeleteIcon onClick={() => delStock(id)} />
      </span>
    </Tooltip>
  );
};

export default DelStock;
