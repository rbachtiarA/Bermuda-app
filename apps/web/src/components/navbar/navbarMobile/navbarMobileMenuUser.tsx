import { AddressSelector } from '@/components/address/addressSelector';
import { useAppSelector } from '@/redux/hook';
import { Button, Chip, Divider, Link, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export default function NavbarMobileMenu({
  token,
  onLogout,
  setDropdownHamburger
}: {
  token: string | null;
  onLogout: () => void;
  setDropdownHamburger: Dispatch<SetStateAction<boolean>>;
}) {
  const user = useAppSelector((state) => state.user);
  const store = useAppSelector((state) => state.store);
  const router = useRouter();
  const onClickLink = (link: string) => {
	router.push(link)
	setDropdownHamburger(false)
  }
  return (
    <>
      <div className="px-4">
        <h2 className="font-bold text-xl py-2">Store</h2>
        <div className="w-full flex flex-col gap-2 py-2 px-4">
            <div className='flex items-center gap-2'>
              <p className='font-semibold'>
                Branch Store : {store.name}
              </p>
              {!store.inRange && 
                <Tooltip content='Your location more than 50 km from nearest store'>
                  <Chip size='sm' color='danger' variant='flat'>Out of Range</Chip>
                </Tooltip>
              }
            </div>
            <AddressSelector />
        </div>
        <h2 className="font-bold text-xl py-2">Akun</h2>
        {!token && (
          <div className="w-full grid grid-cols-2 gap-2 p-2">
            <Button as={Link} href="/login" color="primary">
              Login
            </Button>
            <Button
              as={Link}
              href="/register"
              color="primary"
              variant="bordered"
            >
              Register
            </Button>
          </div>
        )}
        {token && (
          <div className="w-full flex flex-col gap-2 py-2 px-4">
            <>
                <Link color="foreground" onClick={() => onClickLink("/account")}>
                  My Account
                </Link>
                <Link color="foreground" onClick={() => onClickLink("/account/order")}>
                  My Orders
                </Link>
                <Link color="foreground" onClick={() => onClickLink("/account/payment")}>
                  My Active Payment
                </Link>
            </>
            {/* {user.role === 'SUPER_ADMIN' && (
              <>
                <Link href="/admin/user-management" color="foreground">
                  User Management
                </Link>
                <Link href="/admin/store-admin-management" color="foreground">
                  Store Admin Management
                </Link>
                <Link href="/admin/store" color="foreground">
                  Store Management
                </Link>
                <Link
                  href="/admin/product-category-management"
                  color="foreground"
                >
                  Product Category Management
                </Link>
                <Link href="/admin/product-management" color="foreground">
                  Product Management
                </Link>
                <Link href="/admin/stock-management" color="foreground">
                  Stock Management
                </Link>
                <Link href="/admin/discount-management" color="foreground">
                  Discount Management
                </Link>
                <Link href="/admin/order-management" color="foreground">
                  Order Management
                </Link>
                <Link href="/admin/report-analysis" color="foreground">
                  Report & Analysis
                </Link>
              </>
            )} */}
            {(user.role === 'STORE_ADMIN' || user.role === 'SUPER_ADMIN') && (
              <Link onClick={() => onClickLink('/admin')}>Admin Dashboard</Link>
            )}
            <Button
              color="primary"
              variant="bordered"
              className="my-4"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
      <Divider />
      <div className="px-4">
        <h2 className="font-bold text-xl py-2">Products</h2>
        <div className="px-4">
          <Link href="/product" color="foreground">
            All Products
          </Link>
        </div>
      </div>
    </>
  );
}
