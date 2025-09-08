import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  MessageCircle, 
  Star, 
  Code, 
  Trophy,
  Clock,
  CheckCircle,
  Heart,
  Eye
} from 'lucide-react';

const RecentActivity = () => {
  // Mock activity data - in real app this would come from API
  const activities = [
    {
      id: 1,
      type: 'course_complete',
      title: '完成了课程"Python基础语法"',
      description: '获得了 150 积分',
      icon: BookOpen,
      iconBg: 'bg-green-500',
      time: '2小时前',
      link: '/courses/python-basics',
    },
    {
      id: 2,
      type: 'post_liked',
      title: '你的帖子"AI学习心得"获得了10个赞',
      description: '社区反响热烈',
      icon: Heart,
      iconBg: 'bg-red-500',
      time: '4小时前',
      link: '/community/posts/ai-learning-experience',
    },
    {
      id: 3,
      type: 'comment',
      title: '在"机器学习入门"课程中发表了评论',
      description: '感谢老师的详细讲解',
      icon: MessageCircle,
      iconBg: 'bg-blue-500',
      time: '6小时前',
      link: '/courses/ml-intro',
    },
    {
      id: 4,
      type: 'code_run',
      title: '在代码编辑器中成功运行了Python代码',
      description: '实现了数据排序算法',
      icon: Code,
      iconBg: 'bg-purple-500',
      time: '1天前',
      link: '/editor',
    },
    {
      id: 5,
      type: 'achievement',
      title: '获得了"连续学习7天"成就',
      description: '保持良好的学习习惯',
      icon: Trophy,
      iconBg: 'bg-yellow-500',
      time: '1天前',
      link: '/profile',
    },
    {
      id: 6,
      type: 'post_create',
      title: '发布了新帖子"JavaScript异步编程技巧"',
      description: '分享学习经验',
      icon: MessageCircle,
      iconBg: 'bg-indigo-500',
      time: '2天前',
      link: '/community/posts/js-async-tips',
    },
  ];

  const getActivityTypeText = (type) => {
    switch (type) {
      case 'course_complete':
        return '课程完成';
      case 'post_liked':
        return '帖子点赞';
      case 'comment':
        return '发表评论';
      case 'code_run':
        return '代码执行';
      case 'achievement':
        return '获得成就';
      case 'post_create':
        return '发布帖子';
      default:
        return '活动';
    }
  };

  const todayActivities = activities.filter(a => 
    a.time.includes('小时前') || a.time === '1天前'
  );
  const earlierActivities = activities.filter(a => 
    !a.time.includes('小时前') && a.time !== '1天前'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-600" />
            最近活动
          </h3>
          <Link 
            to="/profile/activity"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            查看全部 →
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Today's Activities */}
        {todayActivities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
              今天
            </h4>
            <div className="space-y-4">
              {todayActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                  >
                    <div className={`${activity.iconBg} p-2 rounded-lg flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {getActivityTypeText(activity.type)}
                        </span>
                      </div>
                    </div>
                    {activity.link && (
                      <Link
                        to={activity.link}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 hover:text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Earlier Activities */}
        {earlierActivities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
              更早
            </h4>
            <div className="space-y-4">
              {earlierActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (todayActivities.length + index) * 0.1 }}
                    className="flex items-start space-x-3 group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                  >
                    <div className={`${activity.iconBg} p-2 rounded-lg flex-shrink-0 opacity-75`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-primary-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {getActivityTypeText(activity.type)}
                        </span>
                      </div>
                    </div>
                    {activity.link && (
                      <Link
                        to={activity.link}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 hover:text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">还没有活动记录</h4>
            <p className="text-gray-500 mb-4">开始学习来创建你的第一个活动记录</p>
            <Link to="/courses" className="btn btn-primary btn-sm">
              开始学习
            </Link>
          </div>
        )}

        {/* Activity Summary */}
        {activities.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {activities.filter(a => a.type === 'course_complete').length}
                </div>
                <div className="text-xs text-gray-500">完成课程</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {activities.filter(a => a.type === 'post_create' || a.type === 'comment').length}
                </div>
                <div className="text-xs text-gray-500">社区互动</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {activities.filter(a => a.type === 'code_run').length}
                </div>
                <div className="text-xs text-gray-500">代码练习</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;