import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  User,
  MapPin,
  Calendar,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Mail,
  BookOpen,
  Award,
  TrendingUp,
  MessageCircle,
  Settings,
  Edit3,
  Code,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { userAPI, courseAPI, communityAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const isOwnProfile = !userId || userId === currentUser?._id;
  const profileUserId = userId || currentUser?._id;

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery(
    ['userProfile', profileUserId],
    () => userAPI.getUserProfile(profileUserId),
    {
      enabled: !!profileUserId,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch user's enrolled courses
  const { data: coursesData } = useQuery(
    ['userCourses', profileUserId],
    () => courseAPI.getUserCourses(profileUserId),
    {
      enabled: !!profileUserId,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch user's posts
  const { data: postsData } = useQuery(
    ['userPosts', profileUserId],
    () => communityAPI.getUserPosts(profileUserId),
    {
      enabled: !!profileUserId,
      staleTime: 5 * 60 * 1000,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载用户信息...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">用户不存在</h2>
          <p className="text-gray-600 mb-6">您查找的用户可能已被删除或不存在</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const user = profileData.data;
  const courses = coursesData?.data?.courses || [];
  const posts = postsData?.data?.posts || [];

  const stats = [
    {
      label: '已完成课程',
      value: courses.filter(c => c.progress?.completed).length,
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      label: '学习时长',
      value: `${Math.round((user.stats?.totalLearningTime || 0) / 60)}小时`,
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      label: '发布帖子',
      value: posts.length,
      icon: MessageCircle,
      color: 'text-purple-600',
    },
    {
      label: '获得点赞',
      value: user.stats?.totalLikes || 0,
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  const tabs = [
    { id: 'overview', label: '概览', icon: User },
    { id: 'courses', label: '课程', icon: BookOpen },
    { id: 'posts', label: '帖子', icon: MessageCircle },
    { id: 'achievements', label: '成就', icon: Award },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">个人简介</h3>
        <p className="text-gray-700 mb-4">
          {user.bio || '这个用户还没有填写个人简介'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
          
          {user.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="h-4 w-4" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                个人网站
              </a>
            </div>
          )}
          
          {user.email && isOwnProfile && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}
        </div>
        
        {/* Social Links */}
        {(user.socialLinks?.github || user.socialLinks?.twitter || user.socialLinks?.linkedin) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">社交媒体</h4>
            <div className="flex items-center gap-4">
              {user.socialLinks?.github && (
                <a
                  href={`https://github.com/${user.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
              )}
              
              {user.socialLinks?.twitter && (
                <a
                  href={`https://twitter.com/${user.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
                </a>
              )}
              
              {user.socialLinks?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${user.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">技能标签</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最近活动</h3>
        <div className="space-y-3">
          {user.recentActivity?.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-gray-700">{activity.description}</span>
              <span className="text-sm text-gray-500 ml-auto">
                {new Date(activity.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          )) || (
            <p className="text-gray-500">暂无活动记录</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      {courses.length > 0 ? (
        courses.map(course => (
          <motion.div
            key={course._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-sm cursor-pointer"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">{course.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{course.category}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                  
                  {course.progress && (
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${course.progress.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.progress.percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isOwnProfile ? '您还没有报名任何课程' : '该用户还没有报名任何课程'}
          </h3>
          {isOwnProfile && (
            <button
              onClick={() => navigate('/courses')}
              className="btn btn-primary mt-4"
            >
              浏览课程
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map(post => (
          <motion.div
            key={post._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-sm cursor-pointer"
            onClick={() => navigate(`/community/posts/${post._id}`)}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            
            <h4 className="font-bold text-gray-900 mb-2">{post.title}</h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{post.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments || 0}</span>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isOwnProfile ? '您还没有发布任何帖子' : '该用户还没有发布任何帖子'}
          </h3>
          {isOwnProfile && (
            <button
              onClick={() => navigate('/community/create')}
              className="btn btn-primary mt-4"
            >
              发布帖子
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">成就徽章</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {user.achievements?.map((achievement, index) => (
            <div
              key={index}
              className="text-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">
                {achievement.title}
              </h4>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </div>
          )) || (
            <div className="col-span-full text-center py-8">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isOwnProfile ? '继续学习来获得更多成就！' : '该用户还没有获得任何成就'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                <div className="relative">
                  <img
                    src={user.avatar || '/api/placeholder/128/128'}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user.name}
                      </h1>
                      <p className="text-xl text-gray-600 mb-4">
                        {user.title || 'AI学习者'}
                      </p>
                    </div>
                    
                    {isOwnProfile && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate('/profile/settings')}
                          className="btn btn-outline flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          设置
                        </button>
                        <button
                          onClick={() => navigate('/profile/edit')}
                          className="btn btn-primary flex items-center gap-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          编辑资料
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg">
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

            <div className="p-8">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'courses' && renderCourses()}
              {activeTab === 'posts' && renderPosts()}
              {activeTab === 'achievements' && renderAchievements()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;