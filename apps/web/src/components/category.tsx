'use client';
import { getCategories } from '@/lib/category.handler';
import { ICategory } from '@/type/category';
import { useEffect, useState } from 'react';
import CategoryIcon from './icon/categoryIcon';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const CategoryDropdown: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { result } = await getCategories();
        setCategories(result.allCategory || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="default" variant="light" startContent={<CategoryIcon size={20} />}>
          Kategori
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Category List">
        {categories.map((category) => (
          <DropdownItem key={category.id}>{category.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CategoryDropdown;
