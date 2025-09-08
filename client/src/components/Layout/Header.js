import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  BookOpen,
  Code,
  Users,
  Home
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    mobileMenuOpen, 
    toggleMobileMenu, 
    sidebarOpen, 
    toggleSidebar 
  } = useUIStore();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('已成功退出登录');
      navigate('/');
    } catch (error) {
      toast.error('退出登录失败');
    }
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mobile-menu-button"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gradient"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:block">AI编程学习平台</span>
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              首页
            </Link>
            <Link
              to="/courses"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/courses')
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              课程
            </Link>
            <Link
              to="/community"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/community')
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              社区
            </Link>
            {isAuthenticated && (
              <Link
                to="/editor"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/editor')
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <Code className="h-4 w-4 inline mr-2" />
                编辑器
              </Link>
            )}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索课程..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>
            </form>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </button>

                  {/* User dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Home className="h-4 w-4 mr-3" />
                        仪表板
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        个人资料
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        设置
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;