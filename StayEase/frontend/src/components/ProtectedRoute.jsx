import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute({ user, adminOnly = false }) {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
