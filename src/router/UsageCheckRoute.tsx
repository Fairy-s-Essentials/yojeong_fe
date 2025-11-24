import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { ALERT_MESSAGE } from '@/constants/alertMessage';

export const UsageCheckRoute = () => {
  const navigate = useNavigate();

  // TODO: 실제 API로 교체
  const isLimited = true;
  const isLoading = false;

  useEffect(() => {
    if (!isLoading && isLimited) {
      alert(ALERT_MESSAGE.USAGE_LIMIT);
      navigate('/', { replace: true });
    }
  }, [isLimited, isLoading, navigate]);

  if (isLoading) {
    return null;
  }

  if (isLimited) {
    return null;
  }

  return <Outlet />;
};
