import type {
  AccuracyTrend,
  CalendarData,
  CalendarYears,
  HistoryAnalysis,
  HistoryPeriod,
  SummariesData,
  SummariesQueryParams,
} from '@/types/history.type';
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

export const getCalendarYears = async (): Promise<CalendarYears> => {
  const { data } = await api.get('/history/calendar/years');
  return data.data;
};

export const getCalendarData = async (year: number = new Date().getFullYear()): Promise<CalendarData> => {
  const { data } = await api.get('/history/calendar', {
    params: { year },
  });
  return data.data;
};

export const getSummaries = async (params?: SummariesQueryParams): Promise<SummariesData> => {
  const { data } = await api.get('/history/summaries', {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 5,
      isLatest: params?.isLatest ?? true,
      search: params?.search || undefined,
    },
  });
  return data.data;
};
