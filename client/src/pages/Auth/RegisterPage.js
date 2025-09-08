import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Code, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth';
import { useUIStore } from '../../stores/uiStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useUIStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名最多20个字符';
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字、下划线和中文';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密码必须包含至少一个字母和一个数字';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
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
      const result = await authService.register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      
      if (result.success) {
        toast.success('注册成功！欢迎加入AI编程学习平台');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.error || '注册失败');
        setErrors({ submit: result.error });
      }
    } catch (error) {
      toast.error('注册失败，请稍后重试');
      setErrors({ submit: '注册失败，请稍后重试' });
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

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/(?=.*[a-z])/)) strength++;
    if (password.match(/(?=.*[A-Z])/)) strength++;
    if (password.match(/(?=.*[0-9])/)) strength++;
    if (password.match(/(?=.*[!@#$%^&*])/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['很弱', '弱', '一般', '强', '很强'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

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
            加入我们
          </h2>
          <p className="mt-2 text-gray-600">
            创建您的 AI 编程学习账户
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
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.username ? 'input-error' : ''}`}
                  placeholder="请输入用户名"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="请输入邮箱地址"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                  autoComplete="new-password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : ''}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-1 flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  密码匹配
                </div>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
                我同意{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  服务条款
                </a>{' '}
                和{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  隐私政策
                </a>
              </label>
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
                    注册中...
                  </>
                ) : (
                  <>
                    创建账户
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
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
                <span className="px-2 bg-white text-gray-500">已有账户？</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full btn btn-secondary btn-lg justify-center"
              >
                立即登录
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6">
            <div className="text-center text-sm text-gray-600 mb-4">
              注册即可享受：
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                免费访问所有基础课程
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                在线代码编辑器和运行环境
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                加入学习社区和讨论
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                个人学习进度跟踪
              </div>
            </div>
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

export default RegisterPage;