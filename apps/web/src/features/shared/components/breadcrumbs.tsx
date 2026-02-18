'use client';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  title: string;
  label?: string;
  className?: string;
}

export default function TitleBreadcrumbs({ title, label, ...props }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/').filter(Boolean);

  return (
    <div {...props}>
      <Breadcrumbs size="lg">
        <BreadcrumbItem className="font-bold" onPress={() => router.push('/')}>
          Home
        </BreadcrumbItem>

        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1;

          const href = '/' + segments.slice(0, idx + 1).join('/');

          const formatted = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <BreadcrumbItem
              key={`${segment}-${idx}`}
              className="font-bold"
              onPress={() => !isLast && router.push(href)}
            >
              {isLast && label ? label : formatted}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
