import { useAppSelector } from "@/redux/hook";
import { Button, Divider, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function NavbarMobileMenu({token, onLogout}: {token: string|null, onLogout: () => void}) {
    const user = useAppSelector(state=> state.user)
    const router = useRouter()
  return (
    <>
        <div className='px-4'>
            <h2 className='font-bold text-xl'>Akun</h2>
            {!token && 
            <div className='w-full grid grid-cols-2 gap-2 p-2'>
                <Button as={Link} href='/login' color='primary'>
                    Masuk
                </Button>
                <Button as={Link} href='/register' color='primary' variant='bordered'>
                    Daftar
                </Button>
            </div>
            }
            {
                token && 
                <div className='w-full flex flex-col gap-2 py-2 *:px-4'>
                <Link href='/user' color='foreground'>Akun Saya</Link>
                <Link href='/userorder' color='foreground'>Pesanan Saya</Link>
                <Link href='/payment' color='foreground'>Lihat Pembayaran Aktif</Link>
                {
                    user.role === 'STORE_ADMIN' || user.role === 'SUPER_ADMIN' &&
                    <Link onClick={() => router.push('/admin')}>Admin Dashboard</Link>
                }
                <Button color='primary' variant='bordered' className='mt-4' onPress={onLogout}>Logout</Button>
                </div>
            }
        </div>
        <Divider />
        <div className='px-4'>
            <h2 className='font-bold text-xl'>Menu Produk</h2>
            <div className='px-4'>
                <Link href='/product' color='foreground'>Semua Produk</Link>
            </div>
        </div>
    </>
  )
}
