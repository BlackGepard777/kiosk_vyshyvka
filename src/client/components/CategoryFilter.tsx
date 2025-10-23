import React from 'react';
import { Category, CategoryOption } from '../../shared/models';

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="category-filter">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={selectedCategory === category.id ? 'active' : ''}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};