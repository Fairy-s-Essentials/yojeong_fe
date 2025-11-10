export type HistoryPeriod = 7 | 30 | 'all';

/**
 * 학습 기록 분석
 * @summaryCount 읽은 글
 * @averageScore 평균 정확도 (0~100)
 * @consecutiveDays 연속 학습일
 */
export interface HistoryAnalysis {
  summaryCount: number;
  averageScore: number;
  consecutiveDays: number;
}

export interface HistoryAnalysisResponse {
  success: boolean;
  data: HistoryAnalysis;
}
