import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Users, BookOpen, Code, Trophy, TrendingUp, Globe, Star, Zap } from 'lucide-react';
import { userAPI } from '../../../services/api';

const Statistics = () => {
  const { data: leaderboardData } = useQuery(
    'leaderboard',
    userAPI.getLeaderboard,
    {
      staleTime: 10 * 60 * 1000,
      retry: 1,
    }
  );

  // Mock statistics - in real app these would come from API
  const stats = [
    {
      icon: Users,
      label: '活跃用户',
      value: '50,000+',
      description: '来自全球的AI学习者',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: BookOpen,
      label: '课程完成',
      value: '100,000+',
      description: '累计课程完成数',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Code,
      label: '代码项目',
      value: '25,000+',
      description: '学员创建的项目',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      icon: Globe,
      label: '覆盖国家',
      value: '50+',
      description: '遍布全球各地',
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: '快速增长',
      description: '每月新增用户数量持续增长',
      metric: '+2,500',
      period: '本月',
    },
    {
      icon: Star,
      title: '高满意度',
      description: '平台整体满意度评分',
      metric: '4.8/5',
      period: '用户评分',
    },
    {
      icon: Zap,
      title: '学习效率',
      description: '平均完课率',
      metric: '85%',
      period: '完成率',
    },
    {
      icon: Trophy,
      title: '就业成功',
      description: '学员就业成功率',
      metric: '92%',
      period: '就业率',
    },
  ];

  return (
    <section className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            平台数据一览
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            数字见证我们的成长，每个数据背后都是学习者的成功故事
          </p>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${stat.iconColor}`} />
                  </div>
                  
                  <div className="text-white">
                    <div className="text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg font-medium mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm opacity-80">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="h-6 w-6 text-white" />
                  <h3 className="font-semibold text-lg">
                    {achievement.title}
                  </h3>
                </div>
                
                <p className="text-sm opacity-80 mb-4">
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {achievement.metric}
                  </div>
                  <div className="text-xs opacity-70 bg-white/10 px-2 py-1 rounded-full">
                    {achievement.period}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Top Learners Preview */}
        {leaderboardData?.data?.leaderboard && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                🏆 本月学习之星
              </h3>
              <p className="text-white/80">
                向优秀的学习者们致敬
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderboardData.data.leaderboard.slice(0, 3).map((learner, index) => (
                <div
                  key={learner._id}
                  className={`text-center ${
                    index === 0 ? 'md:transform md:scale-110 md:z-10' : ''
                  }`}
                >
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-yellow-600' :
                      index === 1 ? 'from-gray-300 to-gray-500' :
                      'from-yellow-600 to-yellow-800'
                    } flex items-center justify-center`}>
                      {learner.avatar ? (
                        <img
                          src={learner.avatar}
                          alt={learner.username}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {learner.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-yellow-700'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <div className="font-semibold mb-1">
                      {learner.username}
                    </div>
                    <div className="text-sm opacity-80 mb-2">
                      {learner.profile?.level || '学习者'}
                    </div>
                    <div className="text-lg font-bold text-yellow-300">
                      {learner.learningProgress?.totalPoints || 0} 积分
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Statistics;