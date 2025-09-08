import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Download,
  Share2,
  Heart,
  CheckCircle,
  PlayCircle,
  Lock,
  Award,
  Target,
  Bookmark,
  MessageCircle
} from 'lucide-react';
import { courseAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch course details
  const { data: courseData, isLoading, error } = useQuery(
    ['course', id],
    () => courseAPI.getCourseById(id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Enroll in course
  const enrollMutation = useMutation(
    () => courseAPI.enrollInCourse(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', id]);
        toast.success('成功报名课程！');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '报名失败，请重试');
      }
    }
  );

  // Save/bookmark course
  const bookmarkMutation = useMutation(
    () => courseAPI.bookmarkCourse(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', id]);
        toast.success('已添加到收藏');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '收藏失败');
      }
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程详情...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">课程不存在</h2>
          <p className="text-gray-600 mb-6">您访问的课程可能已被删除或不存在</p>
          <button
            onClick={() => navigate('/courses')}
            className="btn btn-primary"
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  const course = courseData.data;
  const isEnrolled = course.enrollment?.isEnrolled;
  const isBookmarked = course.isBookmarked;

  const handleEnroll = () => {
    if (!user) {
      toast.error('请先登录');
      navigate('/login');
      return;
    }
    enrollMutation.mutate();
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('请先登录');
      navigate('/login');
      return;
    }
    bookmarkMutation.mutate();
  };

  const tabs = [
    { id: 'overview', label: '课程概述', icon: BookOpen },
    { id: 'curriculum', label: '课程大纲', icon: PlayCircle },
    { id: 'instructor', label: '讲师介绍', icon: Users },
    { id: 'reviews', label: '学员评价', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8"
        >
          <div className="relative">
            <div className="h-64 md:h-80 bg-gradient-to-br from-primary-600 to-primary-800">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Play className="h-16 w-16 text-white opacity-80" />
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {course.level}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">
                        {course.rating || 4.5}
                      </span>
                      <span className="text-gray-600">
                        ({course.reviewCount || 0} 评价)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {course.enrollmentStats?.enrolled || 0} 学员
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {course.duration || '8'} 小时
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <img
                      src={course.instructor?.avatar || '/api/placeholder/40/40'}
                      alt={course.instructor?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {course.instructor?.name || '未知讲师'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.instructor?.title || 'AI专家'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Panel */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-center mb-6">
                    {course.price > 0 ? (
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          ¥{course.price}
                        </div>
                        {course.originalPrice > course.price && (
                          <div className="text-lg text-gray-500 line-through">
                            ¥{course.originalPrice}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-green-600">
                        免费
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {isEnrolled ? (
                      <button
                        onClick={() => navigate(`/courses/${id}/learn`)}
                        className="w-full btn btn-primary flex items-center justify-center gap-2"
                      >
                        <Play className="h-5 w-5" />
                        继续学习
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrollMutation.isLoading}
                        className="w-full btn btn-primary flex items-center justify-center gap-2"
                      >
                        {enrollMutation.isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <BookOpen className="h-5 w-5" />
                            立即报名
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={handleBookmark}
                      className="w-full btn btn-secondary flex items-center justify-center gap-2"
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? '已收藏' : '收藏课程'}
                    </button>
                    
                    <button className="w-full btn btn-outline flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5" />
                      分享课程
                    </button>
                  </div>
                  
                  {/* Course Features */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">课程特色</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        终身访问
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        实战项目
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        结业证书
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        社区支持
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-2 border-b-2 font-medium ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">课程简介</h3>
                  <div className="prose prose-gray max-w-none">
                    <p>{course.longDescription || course.description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">学习目标</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.objectives?.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{objective}</span>
                      </div>
                    )) || (
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">掌握AI编程核心概念和实践技能</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">适合人群</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.targetAudience?.map((audience, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{audience}</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">编程初学者</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">希望转向AI领域的开发者</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'curriculum' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">课程大纲</h3>
                <div className="space-y-4">
                  {course.curriculum?.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900">
                          第{chapterIndex + 1}章: {chapter.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {chapter.lessons?.length || 0} 个课时 · {chapter.duration || '60'} 分钟
                        </p>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {chapter.lessons?.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' ? (
                                <PlayCircle className="h-5 w-5 text-primary-500" />
                              ) : lesson.type === 'quiz' ? (
                                <Award className="h-5 w-5 text-primary-500" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-primary-500" />
                              )}
                              <div>
                                <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                <p className="text-sm text-gray-600">{lesson.duration} 分钟</p>
                              </div>
                            </div>
                            {!isEnrolled && lesson.preview !== true && (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        )) || (
                          <div className="p-4 flex items-center gap-3">
                            <PlayCircle className="h-5 w-5 text-primary-500" />
                            <div>
                              <h5 className="font-medium text-gray-900">课程内容</h5>
                              <p className="text-sm text-gray-600">精心设计的学习内容</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-gray-500 py-8">
                      课程大纲正在完善中...
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'instructor' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">讲师介绍</h3>
                <div className="flex items-start gap-6">
                  <img
                    src={course.instructor?.avatar || '/api/placeholder/120/120'}
                    alt={course.instructor?.name}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {course.instructor?.name || '专业讲师'}
                    </h4>
                    <p className="text-primary-600 font-medium mb-4">
                      {course.instructor?.title || 'AI技术专家'}
                    </p>
                    <p className="text-gray-700 mb-6">
                      {course.instructor?.bio || '拥有丰富的AI技术经验，致力于推广AI编程教育。'}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {course.instructor?.stats?.courses || '10+'}
                        </div>
                        <div className="text-sm text-gray-600">门课程</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {course.instructor?.stats?.students || '1000+'}
                        </div>
                        <div className="text-sm text-gray-600">名学员</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {course.instructor?.stats?.rating || '4.9'}
                        </div>
                        <div className="text-sm text-gray-600">评分</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {course.instructor?.stats?.experience || '5+'}
                        </div>
                        <div className="text-sm text-gray-600">年经验</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">学员评价</h3>
                <div className="text-center text-gray-500 py-8">
                  评价功能正在开发中...
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetailPage;