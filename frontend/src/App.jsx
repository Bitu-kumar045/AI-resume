import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

export const App = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Open Student Dashboard directly on root / and /student */}
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Recruiter Dashboard */}
          <Route path="/recruiter" element={<RecruiterDashboard />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
