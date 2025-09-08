import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Star, Users, Clock, ArrowRight } from 'lucide-react';
import { courseAPI } from '../../../services/api';

const FeaturedCourses = () => {
  const { data: coursesData, isLoading, error } = useQuery(
    'featuredCourses',
    courseAPI.getFeaturedCourses,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const courses = coursesData?.data?.courses || [];

  const skeletonCourses = Array(4).fill(null);

  if (error) {
    return null; // Silently fail for featured content
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            热门课程推荐
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            精选最受欢迎的AI编程课程，帮助你快速提升技能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {isLoading
            ? skeletonCourses.map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            : courses.slice(0, 4).map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail || '/api/placeholder/400/200'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.level === '初学者' ? 'bg-green-100 text-green-800' :
                        course.level === '入门' ? 'bg-blue-100 text-blue-800' :
                        course.level === '中级' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                    {course.isPremium && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                        {course.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {course.instructor?.username}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {course.price === 0 ? '免费' : `¥${course.price}`}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          }
        </div>

        <div className="text-center">
          <Link 
            to="/courses" 
            className="inline-flex items-center btn btn-primary btn-lg"
          >
            查看所有课程
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;