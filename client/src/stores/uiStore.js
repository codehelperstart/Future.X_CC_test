import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Theme
  theme: 'light',
  
  // Navigation
  sidebarOpen: false,
  mobileMenuOpen: false,
  
  // Modals
  modals: {},
  
  // Loading states
  loading: {
    global: false,
    courses: false,
    posts: false,
    profile: false,
  },
  
  // Notifications
  notifications: [],
  
  // Actions
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  
  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },
  
  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open });
  },
  
  // Modal management
  openModal: (modalId, props = {}) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: true, props },
      },
    }));
  },
  
  closeModal: (modalId) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: false, props: {} },
      },
    }));
  },
  
  isModalOpen: (modalId) => {
    return get().modals[modalId]?.isOpen || false;
  },
  
  getModalProps: (modalId) => {
    return get().modals[modalId]?.props || {};
  },
  
  // Loading states
  setLoading: (key, loading) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: loading,
      },
    }));
  },
  
  isLoading: (key) => {
    return get().loading[key] || false;
  },
  
  // Notifications
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...notification,
      createdAt: Date.now(),
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    if (newNotification.autoClose) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  },
  
  // Utility functions
  showSuccess: (message, title) => {
    return get().addNotification({
      type: 'success',
      title,
      message,
    });
  },
  
  showError: (message, title = '错误') => {
    return get().addNotification({
      type: 'error',
      title,
      message,
      autoClose: false,
    });
  },
  
  showWarning: (message, title = '警告') => {
    return get().addNotification({
      type: 'warning',
      title,
      message,
    });
  },
  
  showInfo: (message, title = '信息') => {
    return get().addNotification({
      type: 'info',
      title,
      message,
    });
  },
  
  // Initialize theme from localStorage
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    get().setTheme(savedTheme);
  },
}));