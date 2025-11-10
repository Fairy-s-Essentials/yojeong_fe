import { useQuery } from '@tanstack/react-query';
import { getAccuracyTrend, getCalendarData, getCalendarYears, getHistoryAnalysis } from '../api/history.api';
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

export const useCalendarYearsQuery = () => {
  return useQuery({
    queryKey: ['calendarYears'],
    queryFn: getCalendarYears,
  });
};

export const useCalendarDataQuery = (year: number = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ['calendarData', year],
    queryFn: () => getCalendarData(year),
  });
};
