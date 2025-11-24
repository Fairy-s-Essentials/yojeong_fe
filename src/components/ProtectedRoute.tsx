import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth/useAuth';

const ProtectedRoute = () => {
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

  return <Outlet />;
};

export default ProtectedRoute;
