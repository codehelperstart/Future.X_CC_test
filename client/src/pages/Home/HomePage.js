import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Code, 
  Users, 
  Trophy,
  BookOpen,
  Zap,
  Star,
  Play,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import FeaturedCourses from './components/FeaturedCourses';
import TrendingPosts from './components/TrendingPosts';
import Statistics from './components/Statistics';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Code,
      title: 'AI辅助编程',
      description: '集成多种AI编程工具，提供智能代码补全、错误检测和优化建议',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: BookOpen,
      title: '结构化课程',
      description: '从基础到高级的完整学习路径，循序渐进掌握AI编程技能',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Users,
      title: '社区交流',
      description: '与全球AI学习者交流经验，分享项目，共同成长进步',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Zap,
      title: '实时编程',
      description: '在线代码编辑器支持多种语言，即时运行和调试代码',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const stats = [
    { label: '注册用户', value: '50,000+', icon: Users },
    { label: '完成课程', value: '10,000+', icon: BookOpen },
    { label: '代码项目', value: '25,000+', icon: Code },
    { label: '社区讨论', value: '100,000+', icon: Trophy },
  ];

  const testimonials = [
    {
      name: '张小明',
      role: 'AI工程师',
      avatar: '/api/placeholder/64/64',
      content: '这个平台让我从零基础快速入门AI编程，课程设计很棒，社区氛围也很好！',
      rating: 5,
    },
    {
      name: '李小红',
      role: '数据科学家',
      avatar: '/api/placeholder/64/64',
      content: '实践项目很丰富，让我在学习过程中就能积累实际经验，推荐给所有AI学习者。',
      rating: 5,
    },
    {
      name: '王小华',
      role: '软件开发者',
      avatar: '/api/placeholder/64/64',
      content: '代码编辑器功能强大，支持多种AI框架，学习和实践都很方便。',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                开启你的
                <span className="text-gradient"> AI编程 </span>
                学习之旅
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                专为新手设计的AI编程学习平台，提供结构化课程、实战项目和社区支持。
                从零基础到AI专家，让每个人都能掌握人工智能编程技能。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    进入学习中心
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      免费开始学习
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link to="/courses" className="btn btn-outline btn-lg">
                      <Play className="mr-2 h-5 w-5" />
                      浏览课程
                    </Link>
                  </>
                )}
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-2">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们？
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们提供最全面的AI编程学习体验，帮助你快速掌握前沿技术
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center group hover:shadow-lg transition-shadow duration-300 p-6 rounded-xl"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Statistics */}
      <Statistics />

      {/* Trending Posts */}
      <TrendingPosts />

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              学员评价
            </h2>
            <p className="text-xl text-gray-600">
              看看其他学员是怎么说的
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好开始你的AI编程之旅了吗？
            </h2>
            <p className="text-xl mb-8 opacity-90">
              加入我们的学习社区，掌握未来最重要的技能
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <>
                  <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
                    立即注册
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/courses" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                    免费试学
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm opacity-75">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                免费注册
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                即时开始学习
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                社区支持
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;