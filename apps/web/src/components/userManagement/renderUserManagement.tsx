import React from 'react';
import { Chip, ChipProps, User } from '@nextui-org/react';
import { IUser } from '@/type/user';
import { IconX } from '@tabler/icons-react';
import { CheckIcon } from '../icons/checkIcon';

interface UserCellProps {
  user: IUser;
  columnKey: React.Key;
}

const statusColorMap: Record<string, ChipProps['color']> = {
  true: 'success',
  false: 'danger',
};

const RenderUserManagement: React.FC<UserCellProps> = ({ user, columnKey }) => {
  const cellValue = user[columnKey as keyof IUser];

  switch (columnKey) {
    // case 'name':
    //   return (
    //     <User classNames={{ description: 'text-default-500' }} name={cellValue}>
    //       {user.name}
    //     </User>
    //   );
    case 'name':
      return (
        <User
          avatarProps={{ radius: 'full', size: 'sm', src: user.avatarUrl }}
          classNames={{ description: 'text-default-500' }}
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
    case 'isVerified':
      const statusKey = user.isVerified.toString();

      return (
        <div className="flex gap-4">
          <Chip
            startContent={
              user.isVerified ? <CheckIcon size={18} /> : <IconX size={18} />
            }
            variant="faded"
            color={statusColorMap[statusKey]} // Warna sesuai status
          >
            {user.isVerified ? 'Verified' : 'Not Verified'}
          </Chip>
        </div>
      );

    default:
      return <>{cellValue}</>;
  }
};

export default RenderUserManagement;
