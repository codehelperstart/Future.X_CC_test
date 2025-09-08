import React from 'react';
import { X } from 'lucide-react';

const CourseFilters = ({ filters, categories, onChange, onClear }) => {
  const levels = ['初学者', '入门', '中级', '高级'];
  const priceOptions = [
    { value: '', label: '全部' },
    { value: 'false', label: '免费' },
    { value: 'true', label: '付费' },
  ];

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    value && value !== '' && key !== 'search' && key !== 'sort' && key !== 'page'
  );

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">当前筛选:</span>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  {filters.category}
                  <button
                    onClick={() => onChange('category', '')}
                    className="ml-1 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.level && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {filters.level}
                  <button
                    onClick={() => onChange('level', '')}
                    className="ml-1 hover:text-green-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.isPremium !== '' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  {filters.isPremium === 'true' ? '付费' : '免费'}
                  <button
                    onClick={() => onChange('isPremium', '')}
                    className="ml-1 hover:text-yellow-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            清除全部
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            课程分类
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ''}
                onChange={(e) => onChange('category', e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">全部分类</span>
            </label>
            {categories.map((category) => (
              <label key={category._id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category._id}
                  checked={filters.category === category._id}
                  onChange={(e) => onChange('category', e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600 flex-1">
                  {category._id}
                </span>
                <span className="text-xs text-gray-400">
                  ({category.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            难度等级
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="level"
                value=""
                checked={filters.level === ''}
                onChange={(e) => onChange('level', e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">全部等级</span>
            </label>
            {levels.map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={filters.level === level}
                  onChange={(e) => onChange('level', e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            价格类型
          </label>
          <div className="space-y-2">
            {priceOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="isPremium"
                  value={option.value}
                  checked={filters.isPremium === option.value}
                  onChange={(e) => onChange('isPremium', e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          快速筛选
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onChange('level', '初学者');
              onChange('isPremium', 'false');
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            新手免费课程
          </button>
          <button
            onClick={() => {
              onChange('category', 'AI基础');
              onChange('level', '初学者');
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            AI入门
          </button>
          <button
            onClick={() => {
              onChange('category', 'Python编程');
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Python课程
          </button>
          <button
            onClick={() => {
              onChange('category', '机器学习');
              onChange('level', '中级');
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            机器学习进阶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;