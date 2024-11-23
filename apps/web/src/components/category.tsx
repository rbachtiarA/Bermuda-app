'use client';
import { getCategories } from '@/lib/category.handler';
import { ICategory } from '@/type/category';
import { useEffect, useState } from 'react';

const CategoryDropdown: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { result, ok } = await getCategories();
        setCategories(result.allCategory);
        console.log('haloooo', result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div
      className="relative inline-block text-left container"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() =>
        isDropdownOpen ? setIsDropdownOpen(true) : setIsDropdownOpen(false)
      }
      onClick={() => {
        isDropdownOpen ? setIsDropdownOpen(false) : setIsDropdownOpen(true);
      }}
    >
      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-100">
        Kategori
      </button>
      {isDropdownOpen && (
        <div className="order-1 absolute left-0 w-48 mt-2 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1">
            {categories?.map((category) => (
              <li
                key={category.id}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
