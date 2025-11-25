import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { showToast } from '@/utils/toast';
import { useUsageLimit } from '@/services/hooks/usage';

export const UsageCheckRoute = () => {
  console.log('UsageLimitCheck!');
  const navigate = useNavigate();
  const { error, isLoading, isLimited } = useUsageLimit();

  useEffect(() => {
    if (!isLoading && isLimited) {
      showToast('USAGE_LIMIT_EXCEEDED');
      navigate('/', { replace: true });
    }
  }, [isLimited, isLoading, navigate]);

  // 에러 발생 시 로그만 출력하고 계속 진행
  if (error) {
    console.error('사용량 조회 실패:', error);
  }
  if (isLoading) {
    return null;
  }

  if (isLimited) {
    return null;
  }

  return <Outlet />;
};
