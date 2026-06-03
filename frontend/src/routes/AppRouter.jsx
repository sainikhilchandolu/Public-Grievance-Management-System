import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import TrackComplaintPage from '../pages/public/TrackComplaintPage';
import LandingPage from '../pages/public/LandingPage';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import MyComplaints from '../pages/citizen/MyComplaints';
import NewComplaint from '../pages/citizen/NewComplaint';
import ComplaintDetailPage from '../pages/citizen/ComplaintDetailPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageComplaints from '../pages/admin/ManageComplaints';
import ComplaintDetailAdmin from '../pages/admin/ComplaintDetailAdmin';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

// Loading Spinner
import Spinner from '../components/ui/Spinner';

/**
 * Protected Route Component
 * Redirects unauthenticated users to /login
 * Redirects unauthorized roles to their correct dashboard
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRole && user?.role !== allowedRole) {
    return (
      <Navigate
        to={user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/citizen'}
        replace
      />
    );
  }

  return children;
};

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
    <div className="text-8xl mb-6">🏛️</div>
    <h1 className="text-6xl font-black text-gray-800 mb-2">404</h1>
    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
    <p className="text-gray-400 mb-8 max-w-sm">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/login"
      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
    >
      Go Home
    </a>
  </div>
);

/**
 * Root Redirect Component
 * Redirects based on authentication state and role
 */
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/dashboard/citizen" replace />;
};

/**
 * Main Application Router
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Root path */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/track" element={<TrackComplaintPage />} />
      <Route path="/track/:trackingId" element={<TrackComplaintPage />} />

      {/* Citizen Routes */}
      <Route
        path="/dashboard/citizen"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/citizen/complaints"
        element={
          <ProtectedRoute allowedRole="citizen">
            <MyComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/citizen/complaints/new"
        element={
          <ProtectedRoute allowedRole="citizen">
            <NewComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/citizen/complaints/:id"
        element={
          <ProtectedRoute allowedRole="citizen">
            <ComplaintDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/complaints"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/complaints/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <ComplaintDetailAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/analytics"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
