import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Flag,
  Edit,
  Trash2,
  Pin,
  CheckCircle,
  Clock,
  User,
  Code,
  Eye
} from 'lucide-react';
import { postAPI } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import CommentSection from './components/CommentSection';
import CodeBlock from './components/CodeBlock';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Fetch post details
  const { data: postData, isLoading, error } = useQuery(
    ['post', postId],
    () => postAPI.getPost(postId),
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  // Like mutation
  const likeMutation = useMutation(postAPI.likePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]);
    },
    onError: (error) => {
      toast.error('操作失败，请稍后重试');
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation(postAPI.bookmarkPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]);
      toast.success('收藏状态已更新');
    },
    onError: (error) => {
      toast.error('操作失败，请稍后重试');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation(postAPI.deletePost, {
    onSuccess: () => {
      toast.success('帖子已删除');
      navigate('/community');
    },
    onError: (error) => {
      toast.error('删除失败，请稍后重试');
    },
  });

  const post = postData?.data?.post;

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    likeMutation.mutate(postId);
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    bookmarkMutation.mutate(postId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个帖子吗？此操作不可撤销。')) {
      deleteMutation.mutate(postId);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">帖子不存在</h2>
          <p className="text-gray-600 mb-6">该帖子可能已被删除或移动</p>
          <Link to="/community" className="btn btn-primary">
            返回社区
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = isAuthenticated && post.likes?.includes(user?._id);
  const isBookmarked = isAuthenticated && post.bookmarks?.includes(user?._id);
  const isAuthor = isAuthenticated && post.author?._id === user?._id;
  const canEdit = isAuthor || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            to="/community"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回社区
          </Link>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  {post.author?.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {post.author?.username || '匿名用户'}
                    </h3>
                    {post.author?.profile?.level && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {post.author.profile.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{timeAgo(post.createdAt)}</span>
                    {post.updatedAt !== post.createdAt && (
                      <span className="ml-2 text-gray-400">
                        (已编辑)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {canEdit && (
                  <>
                    <Link
                      to={`/community/posts/${postId}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                      title="编辑帖子"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-700 transition-colors"
                      title="删除帖子"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                  title="分享帖子"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center space-x-2 mb-4">
              {post.isSticky && (
                <span className="inline-flex items-center text-sm font-medium text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                  <Pin className="h-4 w-4 mr-1" />
                  置顶
                </span>
              )}
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              {post.status && (
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(post.status)}`}>
                  {post.status === '已解决' && <CheckCircle className="h-4 w-4 mr-1 inline" />}
                  {post.status}
                </span>
              )}
              {post.difficulty && (
                <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {post.difficulty}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views || 0} 浏览
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {post.likeCount || 0} 点赞
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.commentCount || 0} 评论
              </span>
              <span className="flex items-center">
                <Bookmark className="h-4 w-4 mr-1" />
                {post.bookmarkCount || 0} 收藏
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-6">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            {/* Code Blocks */}
            {post.codeBlocks && post.codeBlocks.length > 0 && (
              <div className="space-y-4 mb-6">
                {post.codeBlocks.map((codeBlock, index) => (
                  <CodeBlock
                    key={index}
                    code={codeBlock.code}
                    language={codeBlock.language}
                    description={codeBlock.description}
                  />
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likeCount || 0}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  disabled={bookmarkMutation.isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{post.bookmarkCount || 0}</span>
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>分享</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};

export default PostDetailPage;