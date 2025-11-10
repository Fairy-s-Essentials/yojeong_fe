import type { AccuracyTrend, HistoryAnalysis, HistoryPeriod } from '@/types/history.type';
import api from '.';

export const getHistoryAnalysis = async (period: HistoryPeriod = 7): Promise<HistoryAnalysis> => {
  const { data } = await api.get('/history/analysis', {
    params: { period },
  });
  return data.data;
};

export const getAccuracyTrend = async (period: HistoryPeriod = 7): Promise<AccuracyTrend> => {
  const { data } = await api.get('/history/accuracy-trend', {
    params: { period },
  });
  return data.data;
};
