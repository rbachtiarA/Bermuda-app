import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const UserPlusIcon = () => {
  return (
    <div className="text-2xl text-default-400 pointer-events-none flex-shrink-0">
      <FontAwesomeIcon icon={faUser} />
    </div>
  );
};

export default UserPlusIcon;
