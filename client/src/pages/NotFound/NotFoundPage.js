import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, BookOpen, Users } from 'lucide-react';

const NotFoundPage = () => {
  const quickLinks = [
    {
      title: '回到首页',
      description: '返回AI编程学习平台首页',
      href: '/',
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      title: '浏览课程',
      description: '探索我们的编程课程',
      href: '/courses',
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: '加入社区',
      description: '与其他学习者交流讨论',
      href: '/community',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: '搜索内容',
      description: '搜索您需要的学习资源',
      href: '/courses?search=',
      icon: Search,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-bold text-primary-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl"
              >
                🤖
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            哎呀！页面找不到了
          </h2>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            看起来这个页面在学习新技能的时候走丢了。<br />
            不过别担心，我们有很多其他精彩的内容等着你！
          </p>
          
          {/* Fun Message */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
            <div className="text-lg text-gray-700 mb-2">
              💡 <strong>AI 小助手说：</strong>
            </div>
            <p className="text-gray-600">
              "在编程世界里，404 错误就像是代码中的小冒险。
              虽然这次我们没找到目标，但每个错误都是学习的机会！"
            </p>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary-200 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${link.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回上一页
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-yellow-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;