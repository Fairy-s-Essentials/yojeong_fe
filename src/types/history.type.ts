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

/**
 * 정확도 추이 데이터 포인트
 * @date 7일/30일: "YYYY-MM-DD", all: "YYYY-MM"
 * @averageScore 평균 정확도 (0~100)
 * @count 해당 기간 학습 횟수
 */
export interface AccuracyDataPoint {
  date: string;
  averageScore: number;
  count: number;
}

/**
 * 정확도 추이 데이터
 */
export interface AccuracyTrend {
  period: HistoryPeriod;
  dataPoints: AccuracyDataPoint[];
}

export interface AccuracyTrendResponse {
  success: boolean;
  data: AccuracyTrend;
}
