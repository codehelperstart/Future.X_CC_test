import React from 'react';

const CategoryFilter = ({ categories, selected, onChange }) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
            selected === category.id
              ? 'bg-primary-100 text-primary-700 border border-primary-200'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </div>
          {category.count > 0 && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              selected === category.id
                ? 'bg-primary-200 text-primary-800'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;