import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layout Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CoursesPage from './pages/Courses/CoursesPage';
import CourseDetailPage from './pages/Courses/CourseDetailPage';
import CodeEditorPage from './pages/CodeEditor/CodeEditorPage';
import CommunityPage from './pages/Community/CommunityPage';
import PostDetailPage from './pages/Community/PostDetailPage';
import CreatePostPage from './pages/Community/CreatePostPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

// Initialize auth store
import './services/auth';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner w-8 h-8"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />
            } 
          />
          
          {/* Public course browsing */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          
          {/* Public community browsing */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/posts/:postId" element={<PostDetailPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/editor" element={<CodeEditorPage />} />
            <Route path="/community/create" element={<CreatePostPage />} />
            <Route path="/profile/:userId?" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;