'use client'

import { NextUIProvider } from '@nextui-org/react';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700']})
export function NextProviders({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <div className={roboto.className}>{children}</div>
    </NextUIProvider>
  )
}