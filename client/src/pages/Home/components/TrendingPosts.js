import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { MessageCircle, Heart, Eye, ArrowRight, TrendingUp } from 'lucide-react';
import { postAPI } from '../../../services/api';

const TrendingPosts = () => {
  const { data: postsData, isLoading, error } = useQuery(
    'trendingPosts',
    postAPI.getTrendingPosts,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const posts = postsData?.data?.posts || [];
  const skeletonPosts = Array(3).fill(null);

  if (error) {
    return null;
  }

  const getCategoryColor = (category) => {
    const colors = {
      '技术讨论': 'bg-blue-100 text-blue-800',
      '学习心得': 'bg-green-100 text-green-800',
      '项目展示': 'bg-purple-100 text-purple-800',
      '求助问答': 'bg-orange-100 text-orange-800',
      'AI工具推荐': 'bg-pink-100 text-pink-800',
      '职业发展': 'bg-indigo-100 text-indigo-800',
      '资源分享': 'bg-teal-100 text-teal-800',
      '其他': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['其他'];
  };

  const timeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-primary-600 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              热门讨论
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            看看社区里正在热烈讨论的话题
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {isLoading
            ? skeletonPosts.map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))
            : posts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      {post.author?.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.author?.username || '匿名用户'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-3 ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    
                    <Link
                      to={`/community/posts/${post._id}`}
                      className="block group-hover:text-primary-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </Link>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{post.views || 0}</span>
                      </div>
                    </div>
                    
                    {post.status && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === '已解决' ? 'bg-green-100 text-green-800' :
                        post.status === '待解决' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {post.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
          }
        </div>

        <div className="text-center">
          <Link 
            to="/community" 
            className="inline-flex items-center btn btn-primary btn-lg"
          >
            加入社区讨论
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingPosts;