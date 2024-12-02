import Link from 'next/link';
import React from 'react';

type FooterItemProps = {
  href: string;
  children: React.ReactNode;
};

export default function FooterItem({ href, children }: FooterItemProps) {
  return (
    <li>
      <Link href={href} className="text-gray-500">
        {children}
      </Link>
    </li>
  );
}
