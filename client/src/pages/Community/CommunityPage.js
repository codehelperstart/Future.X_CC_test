import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  MessageCircle, 
  Users,
  Eye,
  Heart,
  Pin,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { postAPI } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import PostCard from './components/PostCard';
import CategoryFilter from './components/CategoryFilter';
import SortOptions from './components/SortOptions';

const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [showFilters, setShowFilters] = useState(false);

  // Get filters from URL params
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'latest',
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page')) || 1,
  };

  // Fetch posts with current filters
  const { data: postsData, isLoading, error } = useQuery(
    ['posts', filters],
    () => postAPI.getPosts({
      search: filters.search,
      category: filters.category,
      sort: filters.sort,
      status: filters.status,
      page: filters.page,
      limit: 10,
    }),
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  // Fetch trending posts
  const { data: trendingData } = useQuery(
    'trendingPosts',
    postAPI.getTrendingPosts,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const posts = postsData?.data?.posts || [];
  const pagination = postsData?.data?.pagination || {};
  const trendingPosts = trendingData?.data?.posts || [];

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

  const handlePageChange = (page) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: '', name: '全部', icon: '📋', count: 0 },
    { id: '技术讨论', name: '技术讨论', icon: '💻', count: 45 },
    { id: '学习心得', name: '学习心得', icon: '📚', count: 32 },
    { id: '项目展示', name: '项目展示', icon: '🚀', count: 28 },
    { id: '求助问答', name: '求助问答', icon: '❓', count: 67 },
    { id: 'AI工具推荐', name: 'AI工具推荐', icon: '🤖', count: 19 },
    { id: '职业发展', name: '职业发展', icon: '💼', count: 23 },
    { id: '资源分享', name: '资源分享', icon: '📎', count: 41 },
    { id: '其他', name: '其他', icon: '📝', count: 15 },
  ];

  const stats = [
    { label: '总帖子数', value: pagination.total || 0, icon: MessageCircle },
    { label: '活跃用户', value: '2,341', icon: Users },
    { label: '今日新帖', value: '89', icon: Plus },
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
            AI 编程社区
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            与全球 AI 学习者分享经验、讨论技术、展示项目
          </p>
          
          {isAuthenticated && (
            <Link
              to="/community/create"
              className="btn btn-primary btn-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              发布新帖子
            </Link>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">讨论分类</h3>
              <CategoryFilter
                categories={categories}
                selected={filters.category}
                onChange={(category) => handleFilterChange('category', category)}
              />
            </div>

            {/* Trending Posts */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                热门讨论
              </h3>
              <div className="space-y-4">
                {trendingPosts.slice(0, 5).map((post, index) => (
                  <Link
                    key={post._id}
                    to={`/community/posts/${post._id}`}
                    className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <span className={`inline-block w-6 h-6 rounded text-xs font-medium flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {post.title}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{post.views}</span>
                          <Heart className="h-3 w-3 ml-2 mr-1" />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索帖子、用户或内容..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <SortOptions
                    value={filters.sort}
                    onChange={(sort) => handleFilterChange('sort', sort)}
                  />
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-secondary"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    筛选
                  </button>
                </div>
              </div>

              {/* Extended Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        帖子状态
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">全部状态</option>
                        <option value="待解决">待解决</option>
                        <option value="已解决">已解决</option>
                        <option value="讨论中">讨论中</option>
                        <option value="已关闭">已关闭</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">加载帖子时出错</div>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  重试
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  没有找到匹配的帖子
                </h3>
                <p className="text-gray-500 mb-6">
                  尝试调整搜索条件或筛选器
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setSearchParams({})}
                    className="btn btn-secondary mr-4"
                  >
                    查看所有帖子
                  </button>
                  {isAuthenticated && (
                    <Link to="/community/create" className="btn btn-primary">
                      发布第一个帖子
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;