import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Play,
  Crown,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

const CourseCard = ({ course, viewMode = 'grid', index = 0 }) => {
  const { user, isAuthenticated } = useAuthStore();

  const isEnrolled = isAuthenticated && (
    user?.learningProgress?.completedCourses?.some(c => c.courseId === course._id) ||
    user?.learningProgress?.currentCourse === course._id
  );

  const isCompleted = isAuthenticated && 
    user?.learningProgress?.completedCourses?.some(c => c.courseId === course._id);

  const getDifficultyColor = (level) => {
    switch (level) {
      case '初学者':
        return 'bg-green-100 text-green-800';
      case '入门':
        return 'bg-blue-100 text-blue-800';
      case '中级':
        return 'bg-yellow-100 text-yellow-800';
      case '高级':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AI基础': 'bg-blue-100 text-blue-700',
      'Python编程': 'bg-green-100 text-green-700',
      'JavaScript编程': 'bg-yellow-100 text-yellow-700',
      '机器学习': 'bg-purple-100 text-purple-700',
      '深度学习': 'bg-indigo-100 text-indigo-700',
      '自然语言处理': 'bg-pink-100 text-pink-700',
      '计算机视觉': 'bg-teal-100 text-teal-700',
      '数据科学': 'bg-orange-100 text-orange-700',
      'Web开发': 'bg-cyan-100 text-cyan-700',
      '移动开发': 'bg-violet-100 text-violet-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div className="flex">
          {/* Course Image */}
          <div className="w-48 h-32 flex-shrink-0 relative overflow-hidden">
            <img
              src={course.thumbnail || '/api/placeholder/400/200'}
              alt={course.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {course.isPremium && (
              <div className="absolute top-2 right-2">
                <Crown className="h-4 w-4 text-yellow-500" />
              </div>
            )}
            {isCompleted && (
              <div className="absolute top-2 left-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>

          {/* Course Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(course.category)}`}>
                    {course.category}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                <Link to={`/courses/${course._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="ml-4 text-right">
                <div className="text-lg font-bold text-gray-900">
                  {course.price === 0 ? '免费' : `¥${course.price}`}
                </div>
                {isEnrolled && (
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {isCompleted ? '已完成' : '学习中'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.enrollmentStats?.enrolled || 0}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.estimatedTime}小时</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{course.enrollmentStats?.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-400 ml-1">
                    ({course.enrollmentStats?.totalRatings || 0})
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{course.totalLessons || course.lessons?.length || 0}课</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {course.instructor && (
                  <span className="text-sm text-gray-500">
                    {course.instructor.username}
                  </span>
                )}
                <Link
                  to={`/courses/${course._id}`}
                  className="btn btn-primary btn-sm"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {isEnrolled ? '继续学习' : '立即学习'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || '/api/placeholder/400/200'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm bg-white/90 ${getDifficultyColor(course.level)}`}>
            {course.level}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {course.isPremium && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5 rounded-full">
              <Crown className="h-3 w-3 text-white" />
            </div>
          )}
          {isCompleted && (
            <div className="bg-green-500 p-1.5 rounded-full">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/courses/${course._id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn btn-primary"
          >
            <Play className="h-4 w-4 mr-2" />
            {isEnrolled ? '继续学习' : '开始学习'}
          </Link>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(course.category)}`}>
            {course.category}
          </span>
        </div>

        <Link to={`/courses/${course._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{course.enrollmentStats?.enrolled || 0}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.estimatedTime}h</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              <span>{course.enrollmentStats?.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {course.instructor?.avatar ? (
              <img
                src={course.instructor.avatar}
                alt={course.instructor.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {course.instructor?.username?.charAt(0)?.toUpperCase() || 'T'}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">
              {course.instructor?.username || '讲师'}
            </span>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {course.price === 0 ? '免费' : `¥${course.price}`}
            </div>
            {isEnrolled && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isCompleted 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isCompleted ? '已完成' : '学习中'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;