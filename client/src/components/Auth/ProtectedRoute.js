import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner w-8 h-8"></div>
          <p className="text-gray-600">验证登录状态...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    // Check if user has sufficient permissions
    const roleHierarchy = {
      user: 0,
      moderator: 1,
      admin: 2,
    };

    const userLevel = roleHierarchy[user?.role] || -1;
    const requiredLevel = roleHierarchy[requiredRole] || Infinity;

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h2>
            <p className="text-gray-600 mb-6">
              您没有访问此页面的权限。需要 {requiredRole} 权限。
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn btn-primary"
            >
              返回上一页
            </button>
          </div>
        </div>
      );
    }
  }

  // Render children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;