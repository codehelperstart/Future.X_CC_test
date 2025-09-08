import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from 'react-query';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Reply, 
  MoreHorizontal,
  User,
  Clock
} from 'lucide-react';
import { postAPI } from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Get post data to access comments
  const postData = queryClient.getQueryData(['post', postId]);
  const comments = postData?.data?.post?.comments || [];

  // Create comment mutation
  const createCommentMutation = useMutation(postAPI.createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]);
      setNewComment('');
      toast.success('评论发布成功');
    },
    onError: (error) => {
      toast.error('评论发布失败');
    },
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    if (!newComment.trim()) {
      toast.error('请输入评论内容');
      return;
    }

    createCommentMutation.mutate({
      postId,
      content: newComment.trim(),
    });
  };

  const timeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  };

  const validComments = comments.filter(comment => !comment.isDeleted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm mt-8"
    >
      {/* Comments Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          评论 ({validComments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={3}
                  className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-500">
                    支持 Markdown 格式
                  </div>
                  <button
                    type="submit"
                    disabled={createCommentMutation.isLoading || !newComment.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    {createCommentMutation.isLoading ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        发布中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        发布评论
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">登录后参与讨论</p>
            <div className="space-x-4">
              <a href="/login" className="btn btn-primary">
                登录
              </a>
              <a href="/register" className="btn btn-secondary">
                注册
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="p-6">
        {validComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">还没有评论</h4>
            <p className="text-gray-500">成为第一个发表评论的人吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {validComments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start space-x-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-4">
                    {/* Author Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {comment.author?.username || '匿名用户'}
                        </span>
                        {comment.author?.profile?.level && (
                          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                            {comment.author.profile.level}
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Comment Text */}
                    <div className="text-gray-800 leading-relaxed mb-3">
                      {comment.content}
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{comment.likes?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => setReplyingTo(comment._id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        <span>回复</span>
                      </button>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 ml-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`回复 @${comment.author?.username}...`}
                            rows={2}
                            className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <div className="flex items-center justify-end space-x-2 mt-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="btn btn-ghost btn-sm"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => {
                                // Handle reply submission
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              disabled={!replyText.trim()}
                              className="btn btn-primary btn-sm"
                            >
                              回复
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 space-y-4">
                      {comment.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {reply.author?.avatar ? (
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">
                                {reply.author?.username || '匿名用户'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {timeAgo(reply.createdAt)}
                              </span>
                            </div>
                            <div className="text-gray-800 text-sm">
                              {reply.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentSection;