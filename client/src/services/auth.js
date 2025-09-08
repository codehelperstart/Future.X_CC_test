import { useAuthStore } from '../stores/authStore';
import { authAPI } from './api';

// Initialize auth on app start
const initializeAuth = async () => {
  const authStore = useAuthStore.getState();
  const token = localStorage.getItem('token');
  
  if (!token) {
    authStore.setLoading(false);
    return;
  }
  
  try {
    // Verify token and get user data
    const response = await authAPI.getProfile();
    const userData = response.data.data.user;
    
    authStore.login(userData, token);
  } catch (error) {
    // Token is invalid, clear it
    localStorage.removeItem('token');
    authStore.logout();
  }
};

// Auto-initialize auth
initializeAuth();

export const authService = {
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      const authStore = useAuthStore.getState();
      authStore.login(user, token);
      
      return { success: true, data: { user, token } };
    } catch (error) {
      const message = error.response?.data?.message || '登录失败';
      return { success: false, error: message };
    }
  },

  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      const authStore = useAuthStore.getState();
      authStore.login(user, token);
      
      return { success: true, data: { user, token } };
    } catch (error) {
      const message = error.response?.data?.message || '注册失败';
      return { success: false, error: message };
    }
  },

  async logout() {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      const authStore = useAuthStore.getState();
      authStore.logout();
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.data.user;
      
      const authStore = useAuthStore.getState();
      authStore.updateUser(updatedUser);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || '更新资料失败';
      return { success: false, error: message };
    }
  },

  async changePassword(passwordData) {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || '修改密码失败';
      return { success: false, error: message };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const authStore = useAuthStore.getState();
    return authStore.isAuthenticated;
  },

  // Get current user
  getCurrentUser() {
    const authStore = useAuthStore.getState();
    return authStore.user;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  },

  // Check if user is moderator or admin
  isModerator() {
    const user = this.getCurrentUser();
    return user?.role === 'moderator' || user?.role === 'admin';
  },

  // Get user's learning progress
  getLearningProgress() {
    const user = this.getCurrentUser();
    return user?.learningProgress || null;
  },

  // Get user's social stats
  getSocialStats() {
    const user = this.getCurrentUser();
    return user?.socialStats || null;
  },
};