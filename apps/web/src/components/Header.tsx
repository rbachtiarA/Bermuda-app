import AddressBar from './addressBar';
import Category from './category';
import SiteLogo from './logo';
import Navbar from './navbar';

export const Header = () => {
  return (
    <div className="shadow-lg w-full">
      <div className='container'>
        <AddressBar />
      </div>
      <div className="flex container mx-auto items-center">
        <SiteLogo />
        <Navbar />
      </div>
    </div>
  );
};
