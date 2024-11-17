import React from 'react';
import { User } from '@nextui-org/react';
import { EyeIcon } from '@/components/icons/eyeIcon';
import { EditIcon } from '@/components/icons/editIcon';
import { Tooltip } from '@nextui-org/react';
import DelCategory from './deleteCategory';
import { ICategory } from '@/type/category';
import UpdateCategory from './updateCategory';

interface CategorynCellProps {
  category: ICategory;
  columnKey: React.Key;
  onDeleted: () => Promise<void>;
}

const RenderCellCategory: React.FC<CategorynCellProps> = ({
  category,
  columnKey,
  onDeleted,
}) => {
  const cellValue = category[columnKey as keyof ICategory];

  switch (columnKey) {
    case 'name':
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
              <UpdateCategory categoryId={category.id} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete name">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DelCategory id={category.id} onDeleted={onDeleted} />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return <>{cellValue}</>;
  }
};

export default RenderCellCategory;
