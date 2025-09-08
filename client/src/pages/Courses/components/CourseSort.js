import React from 'react';
import { ChevronDown } from 'lucide-react';

const CourseSort = ({ value, onChange }) => {
  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'popular', label: '最受欢迎' },
    { value: 'rating', label: '评分最高' },
    { value: 'difficulty', label: '按难度排序' },
  ];

  const currentOption = sortOptions.find(option => option.value === value);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default CourseSort;