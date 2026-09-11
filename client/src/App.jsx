import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';
import Courses from './pages/courses/Courses';
import Cart from './pages/courses/Cart';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import BatchList from './pages/admin/BatchList';
import BatchForm from './pages/admin/BatchForm';
import Enrollments from './pages/admin/Enrollments';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminNotices from './pages/admin/AdminNotices';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherBatches from './pages/teacher/TeacherBatches';
import TeacherBatchDetail from './pages/teacher/TeacherBatchDetail';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherNotices from './pages/teacher/TeacherNotices';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentBatches from './pages/student/StudentBatches';
import StudentBatchDetail from './pages/student/StudentBatchDetail';
import StudentPayments from './pages/student/StudentPayments';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentNotices from './pages/student/StudentNotices';

import Profile from './pages/Profile';

// Dashboard Redirect Helper
function DashboardRedirect() {
  const { currentRole } = useAuth();
  return <Navigate to={`/${currentRole}/dashboard`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppShell>
            <Routes>
              {/* Public Landing & Information Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Course Catalog & Shopping Cart */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/cart" element={<Cart />} />

              {/* Centralized Role Dashboard Redirect */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Protected Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute><AdminCourses /></ProtectedRoute>} />
              <Route path="/admin/batches" element={<ProtectedRoute><BatchList /></ProtectedRoute>} />
              <Route path="/admin/batches/new" element={<ProtectedRoute><BatchForm /></ProtectedRoute>} />
              <Route path="/admin/batches/:id/edit" element={<ProtectedRoute><BatchForm /></ProtectedRoute>} />
              <Route path="/admin/enrollments" element={<ProtectedRoute><Enrollments /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/attendance" element={<ProtectedRoute><AdminAttendance /></ProtectedRoute>} />
              <Route path="/admin/notices" element={<ProtectedRoute><AdminNotices /></ProtectedRoute>} />

              {/* Teacher Protected Routes */}
              <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/batches" element={<ProtectedRoute><TeacherBatches /></ProtectedRoute>} />
              <Route path="/teacher/batches/:id" element={<ProtectedRoute><TeacherBatchDetail /></ProtectedRoute>} />
              <Route path="/teacher/attendance" element={<ProtectedRoute><TeacherAttendance /></ProtectedRoute>} />
              <Route path="/teacher/notices" element={<ProtectedRoute><TeacherNotices /></ProtectedRoute>} />

              {/* Student Protected Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/batches" element={<ProtectedRoute><StudentBatches /></ProtectedRoute>} />
              <Route path="/student/batches/:id" element={<ProtectedRoute><StudentBatchDetail /></ProtectedRoute>} />
              <Route path="/student/payments" element={<ProtectedRoute><StudentPayments /></ProtectedRoute>} />
              <Route path="/student/attendance" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
              <Route path="/student/notices" element={<ProtectedRoute><StudentNotices /></ProtectedRoute>} />

              {/* Profile Protected Route */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* 404 Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
