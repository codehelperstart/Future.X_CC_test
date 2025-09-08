import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Users, 
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  Play
} from 'lucide-react';
import { courseAPI } from '../../services/api';
import CourseCard from './components/CourseCard';
import CourseFilters from './components/CourseFilters';
import CourseSort from './components/CourseSort';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Get filters from URL params
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    sort: searchParams.get('sort') || 'latest',
    isPremium: searchParams.get('isPremium') || '',
    page: parseInt(searchParams.get('page')) || 1,
  };

  // Fetch courses with current filters
  const { data: coursesData, isLoading, error } = useQuery(
    ['courses', filters],
    () => courseAPI.getCourses({
      search: filters.search,
      category: filters.category,
      level: filters.level,
      sort: filters.sort,
      isPremium: filters.isPremium === 'true' ? true : filters.isPremium === 'false' ? false : undefined,
      page: filters.page,
      limit: 12,
    }),
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  // Fetch course categories for filters
  const { data: categoriesData } = useQuery(
    'courseCategories',
    courseAPI.getCategories,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const courses = coursesData?.data?.courses || [];
  const pagination = coursesData?.data?.pagination || {};
  const categories = categoriesData?.data?.categories || [];

  // Update URL params
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value && value !== '' && value !== 1) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const handleSearch = (searchQuery) => {
    updateFilters({ search: searchQuery, page: 1 });
  };

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value, page: 1 });
  };

  const handleSortChange = (sortValue) => {
    updateFilters({ sort: sortValue, page: 1 });
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search suggestions based on popular searches
  const searchSuggestions = [
    'Python基础',
    '机器学习',
    'JavaScript',
    '深度学习',
    '数据科学',
    '人工智能',
  ];

  // Statistics
  const stats = [
    {
      label: '总课程数',
      value: pagination.total || 0,
      icon: BookOpen,
    },
    {
      label: '热门课程',
      value: courses.filter(c => c.enrollmentStats?.enrolled > 100).length,
      icon: TrendingUp,
    },
    {
      label: '免费课程',
      value: courses.filter(c => c.price === 0).length,
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            探索 AI 编程课程
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            从基础到高级，掌握人工智能编程的核心技能
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索课程、技术或关键词..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Search Suggestions */}
          {filters.search === '' && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-gray-500 mr-2">热门搜索:</span>
              {searchSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle and Sort */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 btn btn-secondary"
              >
                <Filter className="h-4 w-4" />
                筛选
                {Object.values(filters).some(f => f && f !== 'latest' && f !== 1) && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                )}
              </button>
              
              <CourseSort
                value={filters.sort}
                onChange={handleSortChange}
              />
            </div>

            {/* View Mode and Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                找到 {pagination.total || 0} 门课程
              </span>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <CourseFilters
                filters={filters}
                categories={categories}
                onChange={handleFilterChange}
                onClear={() => {
                  setSearchParams({});
                }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Course Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">加载课程时出错</div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                重试
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                没有找到匹配的课程
              </h3>
              <p className="text-gray-500 mb-6">
                尝试调整搜索条件或筛选器
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="btn btn-primary"
              >
                查看所有课程
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {courses.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              
              {/* Page numbers */}
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = pagination.current - 2 + i;
                if (page < 1 || page > pagination.pages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      page === pagination.current
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;