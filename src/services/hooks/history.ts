import { useQuery } from '@tanstack/react-query';
import { getHistoryAnalysis } from '../api/history.api';
import type { HistoryPeriod } from '@/types/history.type';

export const useHistoryAnalysisQuery = (period: HistoryPeriod = 7) => {
  return useQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
  });
};
