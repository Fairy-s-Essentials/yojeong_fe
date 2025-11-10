import { useQuery } from '@tanstack/react-query';
import { getAccuracyTrend, getHistoryAnalysis } from '../api/history.api';
import type { HistoryPeriod } from '@/types/history.type';

export const useHistoryAnalysisQuery = (period: HistoryPeriod = 7) => {
  return useQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
  });
};

export const useAccuracyTrendQuery = (period: HistoryPeriod = 7) => {
  return useQuery({
    queryKey: ['accuracyTrend', period],
    queryFn: () => getAccuracyTrend(period),
  });
};
