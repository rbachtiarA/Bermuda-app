import React from 'react';
import { EyeIcon } from '@/components/icons/eyeIcon';
import { EditIcon } from '@/components/icons/editIcon';
import { Tooltip } from '@nextui-org/react';
import { IProduct } from '@/type/product';
import DelProduct from './deleteProduct';
import currencyRupiah from '@/lib/rupiahCurrency';

interface ProductCellProps {
  product: IProduct;
  columnKey: React.Key;
  onDeleted: () => Promise<void>;
}

const RenderProduct: React.FC<ProductCellProps> = ({
  product,
  columnKey,
  onDeleted,
}) => {
  const cellValue = product[columnKey as keyof IProduct];

  switch (columnKey) {
    case 'name':
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {cellValue as string}
          </p>
        </div>
      );
    case 'price':
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {currencyRupiah(product.price)}
          </p>
        </div>
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2 justify-center">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DelProduct id={product.id} onDeleted={onDeleted} />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return <>{cellValue}</>;
  }
};

export default RenderProduct;
