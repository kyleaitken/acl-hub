import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Role[]; // optional
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, role } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role as Role)) {
    // Optionally navigate to an unauthorized page or back to login
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
