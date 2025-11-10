import type { MainAnalysis, MainRecentSummary } from '@/types/main.type';
import api from '.';

export const getMainAnalysis = async (): Promise<MainAnalysis> => {
  const { data } = await api.get('/main/analysis');
  return data.data;
};

export const getMainRecentSummary = async (): Promise<MainRecentSummary[]> => {
  const { data } = await api.get('/main/recent-summary');
  return data.data;
};
