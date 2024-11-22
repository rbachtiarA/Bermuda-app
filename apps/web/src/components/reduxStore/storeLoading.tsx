import Image from 'next/image';
import { Spinner,  } from '@nextui-org/react'

export default function StoreLoading() {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center gap-3">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Image src="/logo.png" alt="Grocery Logo" width={150} height={150} objectFit="cover"/>
      </div>
      <Spinner color='primary' size='lg'/>
    </div>
  );
}
