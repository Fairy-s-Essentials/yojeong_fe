import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export const UsageCheckRoute = () => {
  const navigate = useNavigate();
  const isLimited = false;

  useEffect(() => {
    if (isLimited) {
      navigate('/', { replace: true });
    }
  }, [isLimited, navigate]);

  return <Outlet />;
};
