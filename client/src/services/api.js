import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      const authStore = useAuthStore.getState();
      authStore.logout();
      toast.error('登录已过期，请重新登录');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('权限不足');
    } else if (response?.status === 404) {
      toast.error('请求的资源不存在');
    } else if (response?.status >= 500) {
      toast.error('服务器错误，请稍后重试');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('请求超时，请检查网络连接');
    } else if (!response) {
      toast.error('网络连接失败，请检查网络设置');
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (userId) => api.get(`/users/${userId}`),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  getFollowers: (userId, params) => api.get(`/users/${userId}/followers`, { params }),
  getFollowing: (userId, params) => api.get(`/users/${userId}/following`, { params }),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  getFeaturedCourses: () => api.get('/courses/featured'),
  getCategories: () => api.get('/courses/categories'),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (courseId, data) => api.put(`/courses/${courseId}`, data),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  completeCourse: (courseId, data) => api.post(`/courses/${courseId}/complete`, data),
  reviewCourse: (courseId, data) => api.post(`/courses/${courseId}/review`, data),
};

export const postAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (postId) => api.get(`/posts/${postId}`),
  getTrendingPosts: () => api.get('/posts/trending'),
  createPost: (data) => api.post('/posts', data),
  updatePost: (postId, data) => api.put(`/posts/${postId}`, data),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  bookmarkPost: (postId) => api.post(`/posts/${postId}/bookmark`),
  createComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
};

export const codeAPI = {
  executeCode: (data) => api.post('/code/execute', data),
  getTemplates: () => api.get('/code/templates'),
  getSnippets: (params) => api.get('/code/snippets', { params }),
};

// Helper functions
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || '操作失败';
  return message;
};

export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  
  return formData;
};

// Upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export default api;