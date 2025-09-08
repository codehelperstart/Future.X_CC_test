import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  Code, 
  Trophy,
  User,
  Settings,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

const Sidebar = ({ mobile = false }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { sidebarOpen, setMobileMenuOpen } = useUIStore();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLinkClick = () => {
    if (mobile) {
      setMobileMenuOpen(false);
    }
  };

  const navigationItems = [
    {
      name: '首页',
      icon: Home,
      href: '/',
      public: true,
    },
    {
      name: '课程',
      icon: BookOpen,
      href: '/courses',
      public: true,
    },
    {
      name: '社区',
      icon: Users,
      href: '/community',
      public: true,
    },
    {
      name: '代码编辑器',
      icon: Code,
      href: '/editor',
      requireAuth: true,
    },
  ];

  const userItems = [
    {
      name: '仪表板',
      icon: Home,
      href: '/dashboard',
    },
    {
      name: '个人资料',
      icon: User,
      href: '/profile',
    },
    {
      name: '排行榜',
      icon: Trophy,
      href: '/leaderboard',
    },
    {
      name: '设置',
      icon: Settings,
      href: '/settings',
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Mobile header */}
      {mobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient">AI学习平台</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* User info (when authenticated) */}
      {isAuthenticated && user && (
        <div className={`p-4 border-b border-gray-200 ${!mobile && !sidebarOpen ? 'px-2' : ''}`}>
          <div className={`flex items-center space-x-3 ${!mobile && !sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            {(mobile || sidebarOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.profile?.level || '初学者'}
                </p>
                <div className="flex items-center mt-1">
                  <Trophy className="h-3 w-3 text-yellow-500 mr-1" />
                  <span className="text-xs text-gray-600">
                    {user.learningProgress?.totalPoints || 0} 积分
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navigationItems
            .filter(item => item.public || (item.requireAuth && isAuthenticated))
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors
                    ${active 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }
                    ${!mobile && !sidebarOpen ? 'justify-center' : ''}
                  `}
                  title={!mobile && !sidebarOpen ? item.name : ''}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
                  {(mobile || sidebarOpen) && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              );
            })}
        </div>

        {/* User-specific navigation */}
        {isAuthenticated && (
          <div className="mt-8">
            {(mobile || sidebarOpen) && (
              <div className="px-4 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  个人中心
                </p>
              </div>
            )}
            <div className="space-y-1 px-2">
              {userItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors
                      ${active 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                      }
                      ${!mobile && !sidebarOpen ? 'justify-center' : ''}
                    `}
                    title={!mobile && !sidebarOpen ? item.name : ''}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
                    {(mobile || sidebarOpen) && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer info */}
      {(mobile || sidebarOpen) && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>© 2024 AI编程学习平台</p>
            <p>帮助新手学习AI编程</p>
          </div>
        </div>
      )}
    </div>
  );

  if (mobile) {
    return <SidebarContent />;
  }

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <SidebarContent />
    </div>
  );
};

export default Sidebar;