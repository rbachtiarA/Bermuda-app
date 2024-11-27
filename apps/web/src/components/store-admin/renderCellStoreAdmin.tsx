import React from 'react';
import { User } from '@nextui-org/react';
import { EditIcon } from '@/components/icons/editIcon';
import { Tooltip } from '@nextui-org/react';
import { IUserState } from '@/type/user';
import DelStoreAdmin from './deleteStoreAdmin';
import UpdateStoreAdmin from './updateStoreAdmin';
// import UpdateStoreAdmin from './updateStoreAdmin';

interface StoreAdminCellProps {
  user: IUserState;
  columnKey: React.Key;
  onDeleted: () => Promise<void>;
}

const RenderCellStoreAdmin: React.FC<StoreAdminCellProps> = ({
  user,
  columnKey,
  onDeleted,
}) => {
  const cellValue = user[columnKey as keyof IUserState];

  switch (columnKey) {
    case 'name':
      return (
        <User
          avatarProps={{ radius: 'full', size: 'sm', src: user.avatarUrl }}
          classNames={{
            description: 'text-default-500',
          }}
          description={user.email}
          name={cellValue as string}
        >
          {user.email}
        </User>
      );
    case 'role':
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {cellValue as string}
          </p>
        </div>
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2 justify-center">
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <UpdateStoreAdmin storeAdminId={user.id} onUpdate={onDeleted} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DelStoreAdmin id={user.id} onDeleted={onDeleted} />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return <>{cellValue}</>;
  }
};

export default RenderCellStoreAdmin;
