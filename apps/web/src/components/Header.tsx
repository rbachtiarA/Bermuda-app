import Category from './category';
import SiteLogo from './logo';
import Navbar from './Navbar';

export const Header = () => {
  return (
    <div className="shadow-lg w-full">
      <div className="flex container mx-auto">
        <Category />
        <Navbar />
      </div>
    </div>
  );
};
