import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from 'react-query';
import { 
  User,
  Mail,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Key,
  Eye,
  EyeOff,
  Save,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Camera,
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    title: user?.title || '',
    website: user?.website || '',
    socialLinks: {
      github: user?.socialLinks?.github || '',
      twitter: user?.socialLinks?.twitter || '',
      linkedin: user?.socialLinks?.linkedin || '',
    },
    avatar: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    pushNotifications: user?.settings?.pushNotifications ?? true,
    courseUpdates: user?.settings?.courseUpdates ?? true,
    communityUpdates: user?.settings?.communityUpdates ?? true,
    marketingEmails: user?.settings?.marketingEmails ?? false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: user?.settings?.profilePublic ?? true,
    showEmail: user?.settings?.showEmail ?? false,
    showProgress: user?.settings?.showProgress ?? true,
    allowMessages: user?.settings?.allowMessages ?? true,
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: user?.settings?.theme || 'light',
    language: user?.settings?.language || 'zh-CN',
    fontSize: user?.settings?.fontSize || 'medium',
  });

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data) => userAPI.updateProfile(data),
    {
      onSuccess: (response) => {
        updateUser(response.data);
        queryClient.invalidateQueries(['userProfile']);
        toast.success('个人资料已更新');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '更新失败');
      }
    }
  );

  // Change password mutation
  const changePasswordMutation = useMutation(
    (data) => userAPI.changePassword(data),
    {
      onSuccess: () => {
        toast.success('密码已更新');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordChange(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '密码更改失败');
      }
    }
  );

  // Update settings mutation
  const updateSettingsMutation = useMutation(
    (data) => userAPI.updateSettings(data),
    {
      onSuccess: () => {
        toast.success('设置已更新');
        queryClient.invalidateQueries(['userProfile']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '设置更新失败');
      }
    }
  );

  // Delete account mutation
  const deleteAccountMutation = useMutation(
    () => userAPI.deleteAccount(),
    {
      onSuccess: () => {
        toast.success('账户已删除');
        // Handle logout and redirect
        window.location.href = '/';
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '账户删除失败');
      }
    }
  );

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (key === 'socialLinks') {
        formData.append('socialLinks', JSON.stringify(profileData.socialLinks));
      } else if (key === 'avatar' && profileData.avatar) {
        formData.append('avatar', profileData.avatar);
      } else if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    });

    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('新密码不匹配');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('密码至少6位');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleNotificationSubmit = () => {
    updateSettingsMutation.mutate({ notifications: notificationSettings });
  };

  const handlePrivacySubmit = () => {
    updateSettingsMutation.mutate({ privacy: privacySettings });
  };

  const handleThemeSubmit = () => {
    updateSettingsMutation.mutate({ theme: themeSettings });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片文件不能超过5MB');
        return;
      }
      setProfileData(prev => ({ ...prev, avatar: file }));
    }
  };

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'privacy', label: '隐私设置', icon: Eye },
    { id: 'appearance', label: '外观设置', icon: Palette },
    { id: 'data', label: '数据管理', icon: Database },
  ];

  const renderProfileTab = () => (
    <form onSubmit={handleProfileSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">头像</label>
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={profileData.avatar 
                ? URL.createObjectURL(profileData.avatar)
                : user?.avatar || '/api/placeholder/80/80'
              }
              alt="头像"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => document.getElementById('avatar-upload').click()}
              className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">建议使用 200x200 像素的图片</p>
            <p className="text-xs text-gray-500">支持 JPG、PNG 格式，最大 5MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            姓名 *
          </label>
          <input
            type="text"
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱 *
          </label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            职业/标题
          </label>
          <input
            type="text"
            id="title"
            value={profileData.title}
            onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="例如：AI工程师、学生"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            所在地
          </label>
          <input
            type="text"
            id="location"
            value={profileData.location}
            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="例如：北京、上海"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="h-4 w-4 inline mr-1" />
            个人网站
          </label>
          <input
            type="url"
            id="website"
            value={profileData.website}
            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          个人简介
        </label>
        <textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="介绍一下自己..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Social Links */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">社交媒体</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Github className="h-4 w-4 inline mr-1" />
              GitHub 用户名
            </label>
            <input
              type="text"
              value={profileData.socialLinks.github}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, github: e.target.value }
              }))}
              placeholder="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Twitter className="h-4 w-4 inline mr-1" />
              Twitter 用户名
            </label>
            <input
              type="text"
              value={profileData.socialLinks.twitter}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, twitter: e.target.value }
              }))}
              placeholder="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Linkedin className="h-4 w-4 inline mr-1" />
              LinkedIn 用户名
            </label>
            <input
              type="text"
              value={profileData.socialLinks.linkedin}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
              }))}
              placeholder="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updateProfileMutation.isLoading}
          className="btn btn-primary flex items-center gap-2"
        >
          {updateProfileMutation.isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          保存更改
        </button>
      </div>
    </form>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <Shield className="h-5 w-5" />
          <span className="font-medium">安全提示</span>
        </div>
        <p className="text-sm text-yellow-700">
          定期更新密码可以保护您的账户安全。建议使用强密码并开启双重验证。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">密码</h4>
            <p className="text-sm text-gray-600">上次更改时间：{user?.passwordLastChanged || '未知'}</p>
          </div>
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="btn btn-outline"
          >
            更改密码
          </button>
        </div>

        {showPasswordChange && (
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前密码
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新密码
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认新密码
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={changePasswordMutation.isLoading}
                className="btn btn-primary"
              >
                {changePasswordMutation.isLoading ? '更新中...' : '更新密码'}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordChange(false)}
                className="btn btn-outline"
              >
                取消
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800 mb-4">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">危险区域</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">删除账户</h4>
            <p className="text-sm text-gray-600">
              永久删除您的账户和所有数据。此操作不可撤销。
            </p>
          </div>
          <button
            onClick={() => setShowDeleteAccount(true)}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            删除账户
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">确认删除账户</h3>
            <p className="text-gray-600 mb-6">
              您确定要删除账户吗？此操作将永久删除您的所有数据，包括课程进度、帖子等。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteAccountMutation.mutate()}
                disabled={deleteAccountMutation.isLoading}
                className="flex-1 btn bg-red-600 text-white hover:bg-red-700"
              >
                {deleteAccountMutation.isLoading ? '删除中...' : '确认删除'}
              </button>
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="flex-1 btn btn-outline"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">设置</h1>
            <p className="text-gray-600">管理您的账户设置和偏好</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'security' && renderSecurityTab()}
              
              {/* Other tabs would be implemented similarly */}
              {activeTab === 'notifications' && (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">通知设置功能开发中...</p>
                </div>
              )}
              
              {activeTab === 'privacy' && (
                <div className="text-center py-12">
                  <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">隐私设置功能开发中...</p>
                </div>
              )}
              
              {activeTab === 'appearance' && (
                <div className="text-center py-12">
                  <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">外观设置功能开发中...</p>
                </div>
              )}
              
              {activeTab === 'data' && (
                <div className="text-center py-12">
                  <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">数据管理功能开发中...</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;