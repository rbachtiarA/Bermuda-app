import React from 'react';
import { Tooltip } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { DeleteIcon } from '../icons/deleteIcon';
import { getToken } from '@/lib/server';
import { IProductDel } from '@/type/product';
import { deleteProduct } from '@/lib/product.handler';

const DelProduct = ({ id, onDeleted }: IProductDel) => {
  const delProduct = async (id: number) => {
    try {
      const token = await getToken();
      const { result, ok } = await deleteProduct({ id }, token);

      if (!ok) throw new Error('Failed to delete Product');

      toast.success('Product deleted successfully');

      await onDeleted();
    } catch (error) {
      toast.error('Failed to delete Product');
      console.error(error);
    }
  };

  return (
    <Tooltip color="danger" content="Delete Product">
      <span className="text-lg text-danger cursor-pointer active:opacity-50">
        <DeleteIcon onClick={() => delProduct(id)} />
      </span>
    </Tooltip>
  );
};

export default DelProduct;
