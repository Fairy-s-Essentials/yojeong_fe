import { useQuery } from '@tanstack/react-query';
import { checkUsage } from '../api/usage.api';

export const useUsageLimit = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['usageLimit'],
    queryFn: checkUsage,
    throwOnError: false, // 에러를 Error Boundary로 전파하지 않음
    retry: 1, // 실패 시 1번만 재시도
    refetchOnWindowFocus: true, // 화면 포커스 시 리페칭
    refetchOnMount: 'always', // 마운트될 때마다 리페칭
    staleTime: 0, // 즉시 stale 상태로 만들어 항상 최신 데이터 가져오기
  });
  const { usage, limit } = data || { usage: 0, limit: 10 };
  const isLimited = usage >= limit;
  return { limit, usage, error, isLoading, isLimited };
};
