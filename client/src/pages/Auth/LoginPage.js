import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Code, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth';
import { useUIStore } from '../../stores/uiStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useUIStore();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.login.trim()) {
      newErrors.login = '请输入用户名或邮箱';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoading('auth', true);

    try {
      const result = await authService.login(formData);
      
      if (result.success) {
        toast.success('登录成功！欢迎回来');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || '登录失败');
        setErrors({ submit: result.error });
      }
    } catch (error) {
      toast.error('登录失败，请稍后重试');
      setErrors({ submit: '登录失败，请稍后重试' });
    } finally {
      setIsSubmitting(false);
      setLoading('auth', false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      login: 'demo@example.com',
      password: 'demo123'
    });
    
    // Auto submit after setting demo data
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            欢迎回来
          </h2>
          <p className="mt-2 text-gray-600">
            登录到您的 AI 编程学习账户
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Login Field */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                用户名或邮箱
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.login}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.login ? 'input-error' : ''}`}
                  placeholder="请输入用户名或邮箱"
                />
              </div>
              {errors.login && (
                <p className="mt-1 text-sm text-red-600">{errors.login}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  记住我
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  忘记密码？
                </a>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{errors.submit}</div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary btn-lg justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    登录中...
                  </>
                ) : (
                  <>
                    登录
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            {/* Demo Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
              >
                使用演示账户登录
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">还没有账户？</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full btn btn-secondary btn-lg justify-center"
              >
                立即注册
              </Link>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              登录即表示您同意我们的{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                服务条款
              </a>{' '}
              和{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                隐私政策
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default LoginPage;