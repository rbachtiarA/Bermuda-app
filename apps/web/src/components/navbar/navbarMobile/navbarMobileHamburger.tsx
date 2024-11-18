import { Divider, Spinner } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';
import ProductNavCard from '@/components/product/productNavCard';
import { IProduct } from '@/type/product';
import NavbarMobileMenu from './navbarMobileMenuUser';

export default function NavbarMobileHamburger({
  dropdownSearch,
  setDropdownSearch,
  dropdownHamburger,
  setDropdownHamburger,
  onLogout,
  token,
  isLoading,
  searchData,
}: {
  dropdownSearch: boolean;
  setDropdownSearch: Dispatch<SetStateAction<boolean>>;
  dropdownHamburger: boolean;
  setDropdownHamburger: Dispatch<SetStateAction<boolean>>;
  onLogout: () => void;
  token: string | null;
  isLoading: boolean;
  searchData: IProduct[];
}) {
  return (
    <>
      <div
        className={`fixed top-[64px] md:top-[97px] z-[12] bg-foreground-500/50 h-screen w-full ${dropdownSearch ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div
          className={`flex flex-col bg-foreground-100 w-full ${dropdownSearch ? 'max-h-[400px]' : 'max-h-0'} overflow-auto transition-all ease-in-out px-2`}
        >
          <div className="flex w-full justify-between p-2">
            <span className="text-foreground-400">
              Atleast input 3 characters
            </span>
            <span
              onClick={() => setDropdownSearch(false)}
              className="hover:cursor-pointer"
            >
              X
            </span>
          </div>
          {isLoading && <Spinner size="sm" />}
          <div className="flex flex-col md:flex-row gap-2 pb-2">
            {searchData.map((product) => (
              <ProductNavCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`fixed top-[64px] md:top-[95px] z-[11] bg-foreground-500/50 w-full h-screen ${dropdownHamburger ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div
          className={`bg-foreground-100 h-screen w-full ${dropdownHamburger ? 'max-h-screen' : 'max-h-0'} overflow-auto transition-all ease-in-out`}
        >
          <div className="w-full flex justify-between my-2 px-4 text-xl">
            <h2 className="font-bold">Menu</h2>
            <span
              onClick={() => setDropdownHamburger(false)}
              className="hover:cursor-pointer px-2"
            >
              X
            </span>
          </div>
          <Divider />
          <NavbarMobileMenu onLogout={onLogout} token={token} />
        </div>
      </div>
    </>
  );
}
