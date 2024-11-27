import React from 'react';
import { Tooltip } from '@nextui-org/react';
import { IStock } from '@/type/stock';
import UpdateStock from './updateStock';
import DelStock from './deleteStock';

interface StocknCellProps {
  stock: IStock;
  columnKey: React.Key;
  onDeleted: () => Promise<void>;
}

const RenderStock: React.FC<StocknCellProps> = ({
  stock,
  columnKey,
  onDeleted,
}) => {
  const cellValue = stock[columnKey as keyof IStock];

  switch (columnKey) {
    case 'id':
      return (
        <div className="justify-center py-2">
          <p className="text-bold text-small capitalize">{cellValue}</p>
        </div>
      );
    case 'quantity':
      return (
        <div className="justify-center py-2">
          <p className="text-bold text-small capitalize">{cellValue}</p>
        </div>
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2 justify-center">
          <Tooltip content="Edit name">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <UpdateStock stockId={stock.id} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete name">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DelStock id={stock.id} onDeleted={onDeleted} />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return <>{cellValue.name}</>;
  }
};

export default RenderStock;
