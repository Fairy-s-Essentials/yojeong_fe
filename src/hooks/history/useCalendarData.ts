import { useMemo } from 'react';
import { useCalendarYearsQuery, useCalendarDataQuery } from '@/services/hooks/history';

/**
 * 캘린더(히트맵) 데이터를 제공하는 훅
 *
 * - 히트맵 데이터 가공
 * - 전체 년도의 날짜 생성
 * - 통계 계산 (최대 연속일, 현재 연속일 등)
 */
export const useCalendarData = (selectedYear: number) => {
  const { data: yearsData } = useCalendarYearsQuery();
  const { data: calendarData } = useCalendarDataQuery(selectedYear);

  // 히트맵 데이터 가공
  const heatmapData = useMemo(() => {
    const dataMap = new Map(calendarData.learningDays.map((day) => [day.date, day.count]));

    // 해당 연도의 모든 날짜 생성
    const allDates = generateYearDates(selectedYear);

    return allDates.map((date) => ({
      date,
      count: dataMap.get(date) || 0,
      level: getHeatmapLevel(dataMap.get(date) || 0),
      tooltip: formatTooltip(date, dataMap.get(date) || 0),
    }));
  }, [calendarData, selectedYear]);

  // 통계 계산
  const stats = useMemo(() => {
    const counts = calendarData.learningDays.map((d) => d.count);
    const totalDays = calendarData.learningDays.length;
    const totalCount = counts.reduce((a, b) => a + b, 0);

    return {
      totalDays,
      totalCount,
      averagePerDay: totalDays > 0 ? totalCount / totalDays : 0,
      maxStreak: calculateMaxStreak(calendarData.learningDays),
      currentStreak: calculateCurrentStreak(calendarData.learningDays),
    };
  }, [calendarData]);

  return {
    years: yearsData.years,
    learningDays: calendarData.learningDays, // 원본 데이터 (Heatmap 컴포넌트용)
    heatmapData, // 가공된 데이터 (필요시 사용)
    stats,
  };
};

// 유틸리티 함수들

function getHeatmapLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function formatTooltip(date: string, count: number): string {
  const formatted = new Date(date).toLocaleDateString('ko-KR');
  return count > 0 ? `${formatted}: ${count}개 학습` : `${formatted}: 학습 없음`;
}

function generateYearDates(year: number): string[] {
  const dates: string[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
}

function calculateMaxStreak(days: Array<{ date: string }>): number {
  if (days.length === 0) return 0;

  const sortedDays = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1].date);
    const currDate = new Date(sortedDays[i].date);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function calculateCurrentStreak(days: Array<{ date: string }>): number {
  if (days.length === 0) return 0;

  const sortedDays = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const checkDate = new Date(today);

  for (const day of sortedDays) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    if (dayDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dayDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  return streak;
}
