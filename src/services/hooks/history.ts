import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getAccuracyTrend,
  getCalendarData,
  getCalendarYears,
  getHistoryAnalysis,
  getSummaries,
} from '../api/history.api';
import type { HistoryPeriod, SummariesQueryParams } from '@/types/history.type';

/**
 * History 분석 데이터 조회 (Suspense 지원)
 */
export const useHistoryAnalysisQuery = (period: HistoryPeriod = 7) => {
  return useSuspenseQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
  });
};

/**
 * 정확도 추이 데이터 조회 (Suspense 지원)
 */
export const useAccuracyTrendQuery = (period: HistoryPeriod = 7) => {
  return useSuspenseQuery({
    queryKey: ['accuracyTrend', period],
    queryFn: () => getAccuracyTrend(period),
  });
};

/**
 * 캘린더 년도 목록 조회 (Suspense 지원)
 */
export const useCalendarYearsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['calendarYears'],
    queryFn: getCalendarYears,
  });
};

/**
 * 특정 년도 캘린더 데이터 조회 (Suspense 지원)
 */
export const useCalendarDataQuery = (year: number = new Date().getFullYear()) => {
  return useSuspenseQuery({
    queryKey: ['calendarData', year],
    queryFn: () => getCalendarData(year),
  });
};

/**
 * 요약 목록 조회 (Suspense 지원)
 */
export const useSummariesQuery = (params?: SummariesQueryParams) => {
  return useSuspenseQuery({
    queryKey: ['summaries', params],
    queryFn: () => getSummaries(params),
  });
};
