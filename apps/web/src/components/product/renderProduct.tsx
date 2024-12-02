import React from 'react';
import { Tooltip, User } from '@nextui-org/react';
import { IProduct } from '@/type/product';
import DelProduct from './deleteProduct';
import currencyRupiah from '@/lib/rupiahCurrency';
import UpdateProduct from './updateProduct';

interface ProductCellProps {
  product: any;
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
        <User
          avatarProps={{
            radius: 'full',
            size: 'sm',
            src: product.imageUrl || product.product.imageUrl,
          }}
          classNames={{
            description: 'text-default-500',
          }}
          description={product.name || product.product.name}
          name={cellValue as string}
        >
          {product.name || product.product.name}
        </User>
      );
    case 'price':
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {currencyRupiah(product.price || product.product.price)}
          </p>
        </div>
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2 justify-center">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              {/* <EyeIcon /> */}
            </span>
          </Tooltip>
          <Tooltip content="Edit product">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <UpdateProduct
                productId={product.id || product.product.id}
                onUpdate={onDeleted}
              />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete product">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DelProduct
                id={product.id || product.product.id}
                onDeleted={onDeleted}
              />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return <>{cellValue}</>;
  }
};

export default RenderProduct;
