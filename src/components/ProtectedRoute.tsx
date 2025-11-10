import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
