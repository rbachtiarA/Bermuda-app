import Image from 'next/image';
import { Spinner,  } from '@nextui-org/react'

export default function StoreLoading() {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Image src="/logo.png" alt="Grocery Logo" width={50} height={50} />
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">
          Grocery
        </span>
      </div>
      <Spinner color='primary' size='lg'/>
    </div>
  );
}
