import { ReactNode } from 'react';

export default function GridBox({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">{children}</div>
  );
}
