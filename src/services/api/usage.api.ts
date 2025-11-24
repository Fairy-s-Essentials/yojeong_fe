import type { UsageLimit } from '@/types/usage.type';
import api from '.';

// 사용량 조회
export const checkUsage = async (): Promise<UsageLimit> => {
  const { data } = await api.get('/usage-limit');
  return data.data;
};
