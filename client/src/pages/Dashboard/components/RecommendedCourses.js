import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  BookOpen, 
  Star, 
  Users, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Zap
} from 'lucide-react';
import { courseAPI } from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';

const RecommendedCourses = () => {
  const { user } = useAuthStore();

  const { data: coursesData, isLoading } = useQuery(
    'recommendedCourses',
    () => courseAPI.getCourses({ limit: 4 }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Mock personalized recommendations based on user data
  const getPersonalizedRecommendations = () => {
    const userLevel = user?.profile?.level || '初学者';
    const userSkills = user?.profile?.skills || [];
    
    // This would be more sophisticated in a real app
    return {
      reason: getRecommendationReason(userLevel, userSkills),
      highlight: getHighlightText(userLevel),
    };
  };

  const getRecommendationReason = (level, skills) => {
    if (level === '初学者') {
      return '基于您的学习水平，我们为您推荐这些入门课程';
    } else if (level === '中级') {
      return '继续提升您的技能，这些进阶课程很适合您';
    } else if (skills.includes('Python')) {
      return '基于您的Python技能，推荐这些相关课程';
    }
    return '为您精心挑选的优质课程';
  };

  const getHighlightText = (level) => {
    if (level === '初学者') {
      return '🎯 新手友好';
    } else if (level === '中级') {
      return '🚀 技能进阶';
    }
    return '⭐ 个性推荐';
  };

  const courses = coursesData?.data?.courses || [];
  const { reason, highlight } = getPersonalizedRecommendations();

  const skeletonCourses = Array(4).fill(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm mb-8"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary-600" />
              为您推荐
            </h3>
            <p className="text-sm text-gray-600 mt-1">{reason}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {highlight}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? skeletonCourses.map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : courses.slice(0, 4).map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
                >
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={course.thumbnail || '/api/placeholder/80/80'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-900 transition-colors">
                          {course.title}
                        </h4>
                        <div className="ml-2 flex-shrink-0">
                          {course.isPremium ? (
                            <span className="inline-block w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></span>
                          ) : (
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                        <span className={`px-2 py-1 rounded-full ${
                          course.level === '初学者' ? 'bg-green-100 text-green-700' :
                          course.level === '入门' ? 'bg-blue-100 text-blue-700' :
                          course.level === '中级' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {course.level}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.estimatedTime}h
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {course.enrollmentStats?.enrolled || 0}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-400" />
                            {course.enrollmentStats?.averageRating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-xs font-medium text-primary-600 hover:text-primary-500 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          查看详情
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          }
        </div>

        {/* Recommendation Categories */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">其他推荐分类</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/courses?category=AI基础"
              className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-200">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                AI基础
              </span>
              <span className="text-xs text-gray-500">12门课程</span>
            </Link>

            <Link
              to="/courses?category=Python编程"
              className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-200">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                Python编程
              </span>
              <span className="text-xs text-gray-500">8门课程</span>
            </Link>

            <Link
              to="/courses?category=机器学习"
              className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-200">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                机器学习
              </span>
              <span className="text-xs text-gray-500">15门课程</span>
            </Link>

            <Link
              to="/courses?level=初学者"
              className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-yellow-200">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                新手入门
              </span>
              <span className="text-xs text-gray-500">6门课程</span>
            </Link>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 text-center">
          <Link 
            to="/courses" 
            className="btn btn-primary"
          >
            浏览所有课程
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendedCourses;