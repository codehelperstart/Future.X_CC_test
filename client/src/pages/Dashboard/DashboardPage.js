import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  BookOpen, 
  Code, 
  Users, 
  Trophy,
  TrendingUp,
  Play,
  Clock,
  Star,
  Target,
  Calendar,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { courseAPI, postAPI, userAPI } from '../../services/api';
import LearningProgress from './components/LearningProgress';
import RecentActivity from './components/RecentActivity';
import RecommendedCourses from './components/RecommendedCourses';
import QuickActions from './components/QuickActions';

const DashboardPage = () => {
  const { user } = useAuthStore();

  const { data: coursesData } = useQuery('dashboardCourses', () =>
    courseAPI.getCourses({ limit: 6 })
  );

  const { data: postsData } = useQuery('dashboardPosts', () =>
    postAPI.getPosts({ limit: 5 })
  );

  const { data: leaderboardData } = useQuery('leaderboard', userAPI.getLeaderboard);

  const stats = [
    {
      name: '完成课程',
      value: user?.learningProgress?.completedCourses?.length || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      name: '学习积分',
      value: user?.learningProgress?.totalPoints || 0,
      icon: Trophy,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      name: '连续天数',
      value: user?.learningProgress?.streak || 0,
      icon: Target,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      name: '发布帖子',
      value: user?.socialStats?.posts || 0,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const currentUserRank = leaderboardData?.data?.leaderboard?.findIndex(
    (u) => u._id === user?._id
  ) + 1 || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}，{user?.username}！
                </h1>
                <p className="text-primary-100 text-lg">
                  准备好继续你的 AI 编程学习之旅了吗？
                </p>
                <div className="flex items-center mt-4 space-x-6 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    今日学习目标
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    预计学习时间: 1小时
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Code className="h-16 w-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`${stat.bgColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Learning Progress */}
          <div className="lg:col-span-2">
            <LearningProgress />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Leaderboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  学习排行榜
                </h3>
                {currentUserRank && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    你的排名: #{currentUserRank}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              {leaderboardData?.data?.leaderboard ? (
                <div className="space-y-4">
                  {leaderboardData.data.leaderboard.slice(0, 5).map((leader, index) => (
                    <div key={leader._id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        {leader.avatar ? (
                          <img
                            src={leader.avatar}
                            alt={leader.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-medium">
                            {leader.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{leader.username}</p>
                        <p className="text-sm text-gray-500">
                          {leader.learningProgress?.totalPoints || 0} 积分
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link 
                    to="/leaderboard"
                    className="block text-center text-sm text-primary-600 hover:text-primary-500 pt-4 border-t border-gray-200"
                  >
                    查看完整排行榜 →
                  </Link>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>排行榜加载中...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recommended Courses */}
        <RecommendedCourses />

        {/* Community Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                社区动态
              </h3>
              <Link 
                to="/community"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                查看更多 →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {postsData?.data?.posts ? (
              <div className="space-y-4">
                {postsData.data.posts.slice(0, 3).map((post) => (
                  <div key={post._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <Link
                      to={`/community/posts/${post._id}`}
                      className="block hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">
                              {post.author?.username}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              post.category === '技术讨论' ? 'bg-blue-100 text-blue-700' :
                              post.category === '学习心得' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {post.likes?.length || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>社区动态加载中...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;