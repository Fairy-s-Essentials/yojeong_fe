import type { HistoryPeriod } from '@/types/history.type';

/**
 * 차트에 표시할 날짜 형식을 period에 따라 변환합니다.
 * @param date - DB에서 받아온 날짜 문자열
 * @param period - 조회 기간 (7, 30, 'all')
 * @returns 포맷된 날짜 문자열
 * - 7, 30일: "DD일" (예: "13일")
 * - all:  "YYYY-MM" 형식 그대로
 */
export const formatChartDate = (date: string, period: HistoryPeriod): string => {
  if (period === 7 || period === 30) {
    const parts = date.split('-');
    const month = parts[1];
    const day = parts[2].split('T')[0];
    return `${month}월 ${day}일`;
  }

  // all일 때는 "YYYY-MM" 형식으로 반환
  const parts = date.split('-');
  return `${parts[0]}-${parts[1]}`;
};
