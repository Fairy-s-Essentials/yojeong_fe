import { useMemo } from 'react';
import { useHistoryAnalysisQuery, useAccuracyTrendQuery } from '@/services/hooks/history';
import { formatChartDate } from '@/utils/formatChartDate';
import type { HistoryPeriod } from '@/types/history.type';

/**
 * History 페이지의 통계 데이터를 제공하는 훅
 *
 * Infrastructure Layer의 쿼리를 조합하고 비즈니스 로직을 적용합니다.
 * - 통계 데이터 가공
 * - 차트 데이터 변환
 * - 추세 분석
 */
export const useHistoryStatsData = (period: HistoryPeriod) => {
  const { data: analysis } = useHistoryAnalysisQuery(period);
  const { data: trend } = useAccuracyTrendQuery(period);

  // 통계 데이터 계산
  const stats = useMemo(() => {
    const currentScore = analysis.averageScore;

    return {
      summaryCount: analysis.summaryCount,
      averageScore: currentScore,
      consecutiveDays: analysis.consecutiveDays,
      grade: calculateGrade(currentScore),
      message: getMotivationMessage(currentScore),
    };
  }, [analysis]);

  // 차트 데이터 변환
  const chartData = useMemo(
    () =>
      trend.dataPoints.map((point) => ({
        date: formatChartDate(point.date, period),
        accuracy: point.averageScore,
        count: point.count,
        fullDate: point.date,
      })),
    [trend, period],
  );

  // 추세 분석
  const trendAnalysis = useMemo(() => {
    const scores = trend.dataPoints.map((p) => p.averageScore);
    return {
      average: calculateAverage(scores),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      volatility: calculateVolatility(scores),
    };
  }, [trend]);

  return {
    stats,
    chartData,
    trendAnalysis,
  };
};

// 비즈니스 로직 함수들

function calculateGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function getMotivationMessage(score: number): string {
  if (score >= 90) return '🎉 완벽해요! 최고예요!';
  if (score >= 80) return '👍 훌륭해요! 계속 유지하세요!';
  if (score >= 70) return '💪 좋아요! 조금만 더 힘내봐요!';
  if (score >= 60) return '📚 괜찮아요! 꾸준히 하면 됩니다!';
  return '💪 힘내세요! 조금씩 발전하고 있어요!';
}

function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateVolatility(scores: number[]): number {
  if (scores.length === 0) return 0;
  const avg = calculateAverage(scores);
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
  return Math.sqrt(variance);
}
