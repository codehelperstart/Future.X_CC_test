import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      login: (userData, token) => {
        localStorage.setItem('token', token);
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Initialize auth from stored token
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          // Token will be validated by axios interceptor
          set({ token, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      // Check if user has specific permission
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        
        const rolePermissions = {
          admin: ['read', 'write', 'delete', 'moderate'],
          moderator: ['read', 'write', 'moderate'],
          user: ['read', 'write'],
        };
        
        return rolePermissions[user.role]?.includes(permission) || false;
      },

      // Get user's learning stats
      getLearningStats: () => {
        const { user } = get();
        if (!user?.learningProgress) return null;
        
        return {
          totalPoints: user.learningProgress.totalPoints || 0,
          completedCourses: user.learningProgress.completedCourses?.length || 0,
          currentCourse: user.learningProgress.currentCourse,
          streak: user.learningProgress.streak || 0,
        };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);