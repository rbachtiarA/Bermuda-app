import React from 'react';
import { Tooltip } from '@nextui-org/react';
import { IDiscountAll } from '@/type/discount';
import { EditIcon } from '../icons/editIcon';
import { DeleteIcon } from '../icons/deleteIcon';
// import UpdateStock from './updateStock';
// import DelStock from './deleteStock';

interface DiscountCellProps {
  discount: IDiscountAll;
  columnKey: React.Key;
  // onDeleted: () => Promise<void>;
}

const RenderExam: React.FC<DiscountCellProps> = ({ discount, columnKey }) => {
  const cellValue = discount[columnKey as keyof IDiscountAll];

  switch (columnKey) {
    case 'id':
    case 'discountType':
    case 'minPurchase':
    case 'productId':
    case 'storeId':
    case 'value':
      return <div className="text-small">{cellValue}</div>;
    case 'actions':
      return (
        <div className="flex items-center gap-2 justify-center">
          <Tooltip content="Edit">
            <span className="cursor-pointer">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip content="Delete">
            <span className="cursor-pointer text-danger">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return <div className="text-small">{cellValue}</div>;
  }
};

export default RenderExam;
