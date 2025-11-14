import { useQuery } from '@tanstack/react-query';
import { getMainAnalysis, getMainRecentSummary } from '../api/main.api';

/**
 * 메인 페이지 분석 데이터 조회
 * - 로그인 선택적 (enabled 옵션으로 제어 가능)
 * - 로그인 안 한 사용자는 빈 데이터 표시
 */
export const useMainAnalysisQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['mainAnalysis'],
    queryFn: getMainAnalysis,
    enabled,
  });
};

/**
 * 메인 페이지 최근 요약 조회
 * - 로그인 선택적 (enabled 옵션으로 제어 가능)
 * - 로그인 안 한 사용자는 빈 배열 표시
 */
export const useMainRecentSummaryQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['mainRecentSummary'],
    queryFn: getMainRecentSummary,
    enabled,
  });
};
