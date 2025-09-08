import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  BookOpen, 
  Users, 
  Plus,
  PlayCircle,
  MessageSquare,
  Search,
  Lightbulb,
  Target,
  Calendar
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: '代码编辑器',
      description: '在线编写和运行代码',
      icon: Code,
      href: '/editor',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: '浏览课程',
      description: '发现新的学习内容',
      icon: BookOpen,
      href: '/courses',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: '社区讨论',
      description: '与其他学员交流',
      icon: Users,
      href: '/community',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: '发布帖子',
      description: '分享你的学习心得',
      icon: Plus,
      href: '/community/create',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
  ];

  const quickLinks = [
    {
      title: '学习计划',
      description: '制定个人学习计划',
      icon: Target,
      href: '/learning-plan',
    },
    {
      title: '学习日历',
      description: '查看学习安排',
      icon: Calendar,
      href: '/calendar',
    },
    {
      title: '练习题库',
      description: '巩固所学知识',
      icon: Lightbulb,
      href: '/exercises',
    },
    {
      title: '问答中心',
      description: '寻找问题答案',
      icon: MessageSquare,
      href: '/qa',
    },
  ];

  const todayTasks = [
    {
      id: 1,
      title: '完成Python基础第3课',
      completed: false,
      type: 'course',
    },
    {
      id: 2,
      title: '练习列表推导式',
      completed: true,
      type: 'exercise',
    },
    {
      id: 3,
      title: '回复社区讨论',
      completed: false,
      type: 'community',
    },
    {
      id: 4,
      title: '复习昨天的内容',
      completed: true,
      type: 'review',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">快速操作</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">今日任务</h3>
            <span className="text-sm text-gray-500">
              {todayTasks.filter(task => task.completed).length}/{todayTasks.length} 完成
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  task.completed 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-primary-500'
                }`}>
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.title}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.type === 'course' ? 'bg-blue-100 text-blue-700' :
                  task.type === 'exercise' ? 'bg-purple-100 text-purple-700' :
                  task.type === 'community' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.type === 'course' ? '课程' :
                   task.type === 'exercise' ? '练习' :
                   task.type === 'community' ? '社区' : '复习'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium">
              + 添加新任务
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">常用功能</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  to={link.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <Icon className="h-4 w-4 text-gray-600 group-hover:text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-900">
                      {link.title}
                    </p>
                    <p className="text-xs text-gray-500">{link.description}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">今日学习小贴士</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              在编程时遇到错误不要慌张，仔细阅读错误信息往往能找到解决方案的线索。
              记住：每个错误都是学习的机会！
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;