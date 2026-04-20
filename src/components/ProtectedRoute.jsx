import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Conditional rendering: loading state
  if (loading) return <LoadingSpinner text="Authenticating..." />;

  // Conditional rendering: redirect if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
