import React from 'react';
import { Pagination } from '@nextui-org/react';
import { Selection } from '@nextui-org/react';

interface BottomContentProps {
  selectedKeys: Selection;
  itemsLength: number;
  page: number;
  pages: number;
  hasSearchFilter: boolean;
  onPageChange: (page: number) => void;
}

const BottomContent: React.FC<BottomContentProps> = ({
  selectedKeys,
  itemsLength,
  page,
  pages,
  hasSearchFilter,
  onPageChange,
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        classNames={{ cursor: 'bg-foreground text-background' }}
        color="default"
        isDisabled={hasSearchFilter}
        page={page}
        total={pages}
        variant="light"
        onChange={onPageChange}
      />
      <span className="text-small text-default-400">
        {selectedKeys === 'all'
          ? 'All items selected'
          : `${selectedKeys.size} of ${itemsLength} selected`}
      </span>
    </div>
  );
};

export default BottomContent;
