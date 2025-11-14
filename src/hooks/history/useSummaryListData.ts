import { useMemo } from 'react';
import { useSummariesQuery } from '@/services/hooks/history';
import type { SummariesQueryParams } from '@/types/history.type';

/**
 * 요약 목록 데이터를 제공하는 훅
 *
 * - 요약 아이템 가공 (날짜 포맷, 점수 등급 등)
 * - 페이지네이션 정보 가공
 * - 통계 계산
 */
export const useSummaryListData = (params: SummariesQueryParams) => {
  const { data: summariesData } = useSummariesQuery(params);

  // 요약 아이템 가공
  const items = useMemo(
    () =>
      summariesData.items.map((item) => ({
        ...item,
        // 날짜 포맷팅
        formattedDate: formatRelativeDate(item.createdAt),
        // 점수 등급 (similarityScore 사용)
        scoreGrade: getScoreGrade(item.similarityScore),
        // 하이라이트 (검색어 강조용)
        highlight: params.search,
        // 요약 미리보기 (이미 100자로 제한되어 옴)
        preview: item.userSummary,
      })),
    [summariesData, params.search],
  );

  // 페이지네이션 정보
  const pagination = useMemo(
    () => ({
      ...summariesData.pagination,
      hasMore: summariesData.pagination.currentPage < summariesData.pagination.totalPages,
      hasPrevious: summariesData.pagination.currentPage > 1,
    }),
    [summariesData.pagination],
  );

  // 통계
  const stats = useMemo(() => {
    const scores = items.map((item) => item.similarityScore);
    return {
      count: items.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
    };
  }, [items]);

  return {
    items,
    pagination,
    stats,
    isEmpty: items.length === 0,
  };
};

// 유틸리티 함수들

function formatRelativeDate(date: string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;

  return targetDate.toLocaleDateString('ko-KR');
}

function getScoreGrade(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}
