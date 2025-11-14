import { useSuspenseQuery } from '@tanstack/react-query';
import { getMainAnalysis, getMainRecentSummary } from '../api/main.api';

/**
 * 메인 페이지 분석 데이터 조회
 * - useSuspenseQuery 사용으로 data 항상 정의됨
 * - AsyncBoundary와 함께 사용
 */
export const useMainAnalysisQuery = () => {
  return useSuspenseQuery({
    queryKey: ['mainAnalysis'],
    queryFn: getMainAnalysis,
  });
};

/**
 * 메인 페이지 최근 요약 조회
 * - useSuspenseQuery 사용으로 data 항상 정의됨
 * - AsyncBoundary와 함께 사용
 */
export const useMainRecentSummaryQuery = () => {
  return useSuspenseQuery({
    queryKey: ['mainRecentSummary'],
    queryFn: getMainRecentSummary,
  });
};
