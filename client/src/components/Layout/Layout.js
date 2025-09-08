import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NotificationCenter from '../UI/NotificationCenter';

const Layout = () => {
  const { 
    sidebarOpen, 
    mobileMenuOpen, 
    setSidebarOpen,
    setMobileMenuOpen,
    initializeTheme 
  } = useUIStore();

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <div className={`
          hidden lg:flex lg:flex-shrink-0 transition-all duration-300
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-16'}
        `}>
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl mobile-menu">
              <Sidebar mobile />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 overflow-auto">
              <div className="min-h-full">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Notification Center */}
      <NotificationCenter />
    </div>
  );
};

export default Layout;