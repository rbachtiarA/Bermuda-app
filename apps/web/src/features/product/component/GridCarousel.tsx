import { ReactNode } from 'react';

export default function GridCarousel({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid grid-flow-col auto-cols-[200px] p-1 gap-2 overflow-x-auto"
      // style={{ gridTemplateColumns: `repeat(${data.length},200px)` }}
    >
      {children}
    </div>
  );
}
