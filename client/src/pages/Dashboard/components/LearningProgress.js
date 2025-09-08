import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  TrendingUp,
  Target,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

const LearningProgress = () => {
  const { user } = useAuthStore();

  const currentCourse = user?.learningProgress?.currentCourse;
  const completedCourses = user?.learningProgress?.completedCourses || [];
  const totalPoints = user?.learningProgress?.totalPoints || 0;
  const streak = user?.learningProgress?.streak || 0;

  // Mock current course progress (in real app, this would come from API)
  const mockCurrentCourse = {
    _id: 'current-course-id',
    title: 'Python AI基础入门',
    thumbnail: '/api/placeholder/400/200',
    progress: 65,
    currentLesson: 8,
    totalLessons: 12,
    estimatedTimeLeft: 3.5,
    category: 'AI基础',
    level: '初学者',
  };

  const recentAchievements = [
    {
      id: 1,
      title: '完成第一个课程',
      description: '恭喜完成你的第一门AI编程课程！',
      icon: BookOpen,
      date: '2天前',
      color: 'bg-green-500',
    },
    {
      id: 2,
      title: '连续学习7天',
      description: '保持良好的学习习惯，继续加油！',
      icon: Target,
      date: '1周前',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      title: '积分达到1000',
      description: '你的学习努力得到了认可！',
      icon: Star,
      date: '2周前',
      color: 'bg-yellow-500',
    },
  ];

  const weeklyGoal = {
    target: 10, // hours
    current: 6.5,
    percentage: 65,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
          学习进度
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Course */}
        {currentCourse || mockCurrentCourse ? (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">当前学习课程</h4>
              <span className="text-sm text-gray-500">进度 {mockCurrentCourse.progress}%</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={mockCurrentCourse.thumbnail}
                  alt={mockCurrentCourse.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 line-clamp-1">
                  {mockCurrentCourse.title}
                </h5>
                <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    第 {mockCurrentCourse.currentLesson} / {mockCurrentCourse.totalLessons} 课
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    剩余 {mockCurrentCourse.estimatedTimeLeft}h
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mockCurrentCourse.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <Link
                to={`/courses/${mockCurrentCourse._id}`}
                className="btn btn-primary btn-sm"
              >
                <Play className="h-4 w-4 mr-1" />
                继续学习
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">开始你的学习之旅</h4>
            <p className="text-gray-500 mb-4">选择一门课程开始学习AI编程</p>
            <Link to="/courses" className="btn btn-primary">
              浏览课程
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Weekly Goal */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              本周学习目标
            </h4>
            <span className="text-sm text-gray-600">
              {weeklyGoal.current}/{weeklyGoal.target} 小时
            </span>
          </div>
          
          <div className="mb-2">
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${weeklyGoal.percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">完成 {weeklyGoal.percentage}%</span>
            <span className="text-primary-600 font-medium">
              还需 {(weeklyGoal.target - weeklyGoal.current).toFixed(1)} 小时
            </span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{completedCourses.length}</div>
            <div className="text-sm text-gray-600">完成课程</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-gray-600">连续天数</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            最近成就
          </h4>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`${achievement.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                  <span className="text-xs text-gray-400">{achievement.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Streak */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-sm">🔥</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">学习连击</p>
                <p className="text-sm text-gray-500">保持每日学习习惯</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{streak}</div>
              <div className="text-xs text-gray-500">天</div>
            </div>
          </div>
          
          {/* Streak Calendar (simplified) */}
          <div className="mt-3 flex justify-center space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded ${
                  i < 5 ? 'bg-orange-200' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningProgress;