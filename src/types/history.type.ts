import type { ApiResponse } from './api.type';

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

export interface HistoryAnalysisResponse extends ApiResponse<HistoryAnalysis> {}

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

export interface AccuracyTrendResponse extends ApiResponse<AccuracyTrend> {}

/**
 * 캘린더 연도 목록
 * @years 학습 기록이 존재하는 연도
 */
export interface CalendarYears {
  years: number[];
}

export interface CalendarYearsResponse extends ApiResponse<CalendarYears> {}

/**
 * 학습 일자 데이터
 * @date 날짜 "YYYY-MM-DD"
 * @count 해당 날짜 학습 횟수
 * @averageScore 해당 날짜 평균 점수
 */
export interface LearningDay {
  date: string;
  count: number;
  averageScore: number;
}

/**
 * 캘린더 데이터
 * @year 연도
 * @learningDays 학습 일자 목록
 */
export interface CalendarData {
  year: number;
  learningDays: LearningDay[];
}

export interface CalendarDataResponse extends ApiResponse<CalendarData> {}
