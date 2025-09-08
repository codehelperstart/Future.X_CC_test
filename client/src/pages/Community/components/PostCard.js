import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Bookmark,
  Pin,
  CheckCircle,
  Clock,
  Star,
  User
} from 'lucide-react';

const PostCard = ({ post, index = 0 }) => {
  const getCategoryColor = (category) => {
    const colors = {
      '技术讨论': 'bg-blue-100 text-blue-800 border-blue-200',
      '学习心得': 'bg-green-100 text-green-800 border-green-200',
      '项目展示': 'bg-purple-100 text-purple-800 border-purple-200',
      '求助问答': 'bg-orange-100 text-orange-800 border-orange-200',
      'AI工具推荐': 'bg-pink-100 text-pink-800 border-pink-200',
      '职业发展': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '资源分享': 'bg-teal-100 text-teal-800 border-teal-200',
      '其他': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || colors['其他'];
  };

  const getStatusColor = (status) => {
    const colors = {
      '待解决': 'bg-yellow-100 text-yellow-800',
      '已解决': 'bg-green-100 text-green-800',
      '讨论中': 'bg-blue-100 text-blue-800',
      '已关闭': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors['讨论中'];
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      '入门': 'bg-green-100 text-green-800',
      '初级': 'bg-blue-100 text-blue-800',
      '中级': 'bg-yellow-100 text-yellow-800',
      '高级': 'bg-orange-100 text-orange-800',
      '专家': 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || colors['入门'];
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

  const truncateContent = (content, maxLength = 200) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${
        post.isSticky 
          ? 'border-l-yellow-500 bg-yellow-50' 
          : post.status === '已解决'
          ? 'border-l-green-500'
          : 'border-l-primary-500'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {/* Author Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">
                {post.author?.username || '匿名用户'}
              </span>
              {post.author?.profile?.level && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {post.author.profile.level}
                </span>
              )}
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo(post.createdAt)}
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center space-x-2">
              {post.isSticky && (
                <span className="inline-flex items-center text-xs font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                  <Pin className="h-3 w-3 mr-1" />
                  置顶
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              {post.difficulty && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(post.difficulty)}`}>
                  {post.difficulty}
                </span>
              )}
              {post.status && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(post.status)}`}>
                  {post.status === '已解决' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                  {post.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title and Content */}
      <div className="mb-4">
        <Link to={`/community/posts/${post._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {truncateContent(post.content)}
        </p>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 5).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 5 && (
            <span className="text-xs text-gray-500">
              +{post.tags.length - 5} 更多
            </span>
          )}
        </div>
      )}

      {/* Code Preview */}
      {post.codeBlocks && post.codeBlocks.length > 0 && (
        <div className="mb-4">
          <div className="bg-gray-100 rounded-lg p-3 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">
                {post.codeBlocks[0].language || 'CODE'}
              </span>
              <span className="text-xs text-gray-500">代码片段</span>
            </div>
            <pre className="text-sm text-gray-800 overflow-hidden">
              <code className="line-clamp-3">
                {post.codeBlocks[0].code.substring(0, 150)}
                {post.codeBlocks[0].code.length > 150 && '...'}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <button className="flex items-center hover:text-red-500 transition-colors">
            <Heart className="h-4 w-4 mr-1" />
            <span>{post.likes?.length || 0}</span>
          </button>
          
          <Link 
            to={`/community/posts/${post._id}`}
            className="flex items-center hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{post.comments?.filter(c => !c.isDeleted).length || 0}</span>
          </Link>
          
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{post.views || 0}</span>
          </span>

          <button className="flex items-center hover:text-yellow-500 transition-colors">
            <Bookmark className="h-4 w-4 mr-1" />
            <span>{post.bookmarks?.length || 0}</span>
          </button>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-gray-500">
          最后活动: {timeAgo(post.lastActivity || post.updatedAt)}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;