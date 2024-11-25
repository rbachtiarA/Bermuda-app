import { Tooltip } from '@nextui-org/react';
import { EditIcon } from '../icons/editIcon';

export default function EditAddress({ onEdit }: { onEdit: () => void }) {
  return (
    <Tooltip color="danger" content="Edit Alamat">
      <div className="text-lg  cursor-pointer active:opacity-50">
        <EditIcon onClick={onEdit}/>
      </div>
    </Tooltip>
  );
}
