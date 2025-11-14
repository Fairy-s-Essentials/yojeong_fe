# 구현 코드 예제 모음

> 이 문서는 Suspense & Error Boundary 도입 시 참고할 수 있는 완전한 코드 예제를 제공합니다.

## 📋 목차

1. [유틸리티](#유틸리티)
2. [Boundary 컴포넌트](#boundary-컴포넌트)
3. [스켈레톤 컴포넌트](#스켈레톤-컴포넌트)
4. [에러 컴포넌트](#에러-컴포넌트)
5. [React Query 설정](#react-query-설정)
6. [Application Hooks](#application-hooks)
7. [페이지 컴포넌트](#페이지-컴포넌트)

---

## 유틸리티

### `src/utils/errorHandling.ts`

```typescript
import type { AxiosError } from 'axios';

/**
 * 에러 타입 분류
 */
export enum ErrorType {
  NETWORK = 'NETWORK',           // 네트워크 연결 문제
  UNAUTHORIZED = 'UNAUTHORIZED', // 인증 필요 (401)
  FORBIDDEN = 'FORBIDDEN',       // 권한 없음 (403)
  NOT_FOUND = 'NOT_FOUND',       // 리소스 없음 (404)
  SERVER = 'SERVER',             // 서버 에러 (5xx)
  VALIDATION = 'VALIDATION',     // 입력값 검증 실패 (400)
  UNKNOWN = 'UNKNOWN',           // 알 수 없는 에러
}

/**
 * 애플리케이션 에러 인터페이스
 */
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
  retryable: boolean;
}

/**
 * 에러를 AppError로 분류
 */
export function classifyError(error: unknown): AppError {
  // Axios 에러 처리
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // 네트워크 에러 (서버 응답 없음)
    if (!axiosError.response) {
      return {
        type: ErrorType.NETWORK,
        message: '네트워크 연결을 확인해주세요',
        originalError: error,
        retryable: true,
      };
    }
    
    const statusCode = axiosError.response.status;
    
    // HTTP 상태 코드별 분류
    switch (statusCode) {
      case 401:
        return {
          type: ErrorType.UNAUTHORIZED,
          message: '로그인이 필요합니다',
          statusCode,
          originalError: error,
          retryable: false,
        };
        
      case 403:
        return {
          type: ErrorType.FORBIDDEN,
          message: '접근 권한이 없습니다',
          statusCode,
          originalError: error,
          retryable: false,
        };
        
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: '요청하신 정보를 찾을 수 없습니다',
          statusCode,
          originalError: error,
          retryable: false,
        };
        
      case 400:
        return {
          type: ErrorType.VALIDATION,
          message: '입력 정보를 확인해주세요',
          statusCode,
          originalError: error,
          retryable: false,
        };
        
      default:
        // 5xx 서버 에러
        if (statusCode >= 500) {
          return {
            type: ErrorType.SERVER,
            message: '서버에 일시적인 문제가 발생했습니다',
            statusCode,
            originalError: error,
            retryable: true,
          };
        }
        
        return {
          type: ErrorType.UNKNOWN,
          message: '알 수 없는 오류가 발생했습니다',
          statusCode,
          originalError: error,
          retryable: false,
        };
    }
  }
  
  // 일반 Error 객체
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || '오류가 발생했습니다',
      originalError: error,
      retryable: false,
    };
  }
  
  // 기타 에러
  return {
    type: ErrorType.UNKNOWN,
    message: '알 수 없는 오류가 발생했습니다',
    retryable: false,
  };
}

/**
 * 재시도 가능한 에러인지 판단
 */
export function isRetryableError(error: AppError): boolean {
  return error.retryable;
}

/**
 * 에러 메시지 반환
 */
export function getErrorMessage(error: AppError): string {
  return error.message;
}

/**
 * 에러 제목 반환
 */
export function getErrorTitle(errorType: ErrorType): string {
  const titles: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '네트워크 오류',
    [ErrorType.UNAUTHORIZED]: '로그인 필요',
    [ErrorType.FORBIDDEN]: '접근 권한 없음',
    [ErrorType.NOT_FOUND]: '페이지를 찾을 수 없음',
    [ErrorType.SERVER]: '서버 오류',
    [ErrorType.VALIDATION]: '입력 오류',
    [ErrorType.UNKNOWN]: '오류 발생',
  };
  
  return titles[errorType];
}

/**
 * Axios 에러인지 확인하는 타입 가드
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * 에러 로깅 (개발 환경)
 */
export function logError(error: AppError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error ${context ? `in ${context}` : ''}`);
    console.error('Type:', error.type);
    console.error('Message:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Retryable:', error.retryable);
    if (error.originalError) {
      console.error('Original:', error.originalError);
    }
    console.groupEnd();
  }
  
  // TODO: 프로덕션에서는 Sentry 등으로 전송
}
```

---

## Boundary 컴포넌트

### `src/components/boundaries/ErrorBoundary.tsx`

```typescript
import React, { Component, type ReactNode } from 'react';
import { classifyError, logError, type AppError } from '@/utils/errorHandling';

export interface ErrorFallbackProps {
  error: Error;
  appError: AppError;
  resetErrorBoundary: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 컴포넌트 트리의 에러를 포착하는 Error Boundary
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const appError = classifyError(error);
    logError(appError, 'ErrorBoundary');
    
    // 에러 콜백 호출
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // resetKeys가 변경되면 에러 상태 초기화
    if (
      hasError &&
      resetKeys &&
      prevProps.resetKeys &&
      !areArraysEqual(prevProps.resetKeys, resetKeys)
    ) {
      this.reset();
    }
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (hasError && error) {
      const appError = classifyError(error);
      
      if (Fallback) {
        return (
          <Fallback
            error={error}
            appError={appError}
            resetErrorBoundary={this.reset}
          />
        );
      }

      // 기본 에러 UI
      return (
        <div className="flex items-center justify-center min-h-[200px] p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
            <p className="text-gray-600 mb-4">{appError.message}</p>
            {appError.retryable && (
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

function areArraysEqual(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}
```

---

### `src/components/boundaries/SuspenseBoundary.tsx`

```typescript
import React, { Suspense, type ReactNode } from 'react';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

/**
 * React Suspense 래퍼
 */
export const SuspenseBoundary = ({ children, fallback }: SuspenseBoundaryProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
```

---

### `src/components/boundaries/AsyncBoundary.tsx`

```typescript
import React, { type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, type ErrorFallbackProps } from './ErrorBoundary';
import { SuspenseBoundary } from './SuspenseBoundary';

interface AsyncBoundaryProps {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

/**
 * ErrorBoundary + Suspense + QueryErrorResetBoundary를 결합한 컴포넌트
 * 
 * @example
 * <AsyncBoundary
 *   loadingFallback={<Skeleton />}
 *   errorFallback={ErrorFallback}
 * >
 *   <DataComponent />
 * </AsyncBoundary>
 */
export const AsyncBoundary = ({
  children,
  loadingFallback,
  errorFallback,
  onError,
  onReset,
  resetKeys,
}: AsyncBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={errorFallback}
          onError={onError}
          onReset={() => {
            reset();
            onReset?.();
          }}
          resetKeys={resetKeys}
        >
          <SuspenseBoundary fallback={loadingFallback}>
            {children}
          </SuspenseBoundary>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
```

---

### `src/components/boundaries/index.ts`

```typescript
export { ErrorBoundary } from './ErrorBoundary';
export { SuspenseBoundary } from './SuspenseBoundary';
export { AsyncBoundary } from './AsyncBoundary';
export type { ErrorFallbackProps } from './ErrorBoundary';
```

---

## 스켈레톤 컴포넌트

### `src/components/skeletons/SkeletonBase.tsx`

```typescript
import { cn } from '@/utils/cn';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'rounded' | 'circular' | 'rectangular';
}

/**
 * 기본 스켈레톤 컴포넌트
 */
export const Skeleton = ({
  width,
  height,
  className,
  variant = 'rounded',
}: SkeletonProps) => {
  const variantStyles = {
    rounded: 'rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        'bg-gray-200 animate-pulse',
        variantStyles[variant],
        className
      )}
      style={style}
      role="status"
      aria-label="로딩 중"
    />
  );
};

/**
 * 텍스트 스켈레톤
 */
export const SkeletonText = ({ 
  lines = 1, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};
```

---

### `src/components/skeletons/SkeletonHistoryStats.tsx`

```typescript
import { Skeleton } from './SkeletonBase';

/**
 * History 페이지 통계 카드 스켈레톤
 */
export const SkeletonHistoryStats = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200"
        >
          {/* 아이콘 */}
          <Skeleton variant="circular" width={48} height={48} className="mb-4" />
          
          {/* 값 */}
          <Skeleton height={32} width="60%" className="mb-2" />
          
          {/* 라벨 */}
          <Skeleton height={20} width="40%" />
        </div>
      ))}
    </div>
  );
};
```

---

### `src/components/skeletons/SkeletonLineChart.tsx`

```typescript
import { Skeleton } from './SkeletonBase';

/**
 * 라인 차트 스켈레톤
 */
export const SkeletonLineChart = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      {/* 제목 */}
      <Skeleton height={24} width={120} className="mb-6" />
      
      {/* 차트 영역 */}
      <div className="h-80 flex items-end justify-between gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            width="100%"
            height={`${Math.random() * 60 + 40}%`}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
};
```

---

### `src/components/skeletons/SkeletonHeatmap.tsx`

```typescript
import { Skeleton } from './SkeletonBase';

/**
 * 히트맵 스켈레톤
 */
export const SkeletonHeatmap = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      {/* 제목 */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton height={24} width={120} />
        <Skeleton height={32} width={100} />
      </div>
      
      {/* 히트맵 그리드 */}
      <div className="space-y-1">
        {Array.from({ length: 7 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {Array.from({ length: 53 }).map((_, dayIndex) => (
              <Skeleton
                key={dayIndex}
                width={12}
                height={12}
                variant="rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### `src/components/skeletons/SkeletonSummaryList.tsx`

```typescript
import { Skeleton } from './SkeletonBase';

/**
 * 요약 아이템 스켈레톤
 */
const SkeletonSummaryItem = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
      <div className="flex items-start justify-between mb-3">
        {/* 제목 */}
        <Skeleton height={20} width="60%" />
        {/* 점수 */}
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      
      {/* 날짜 */}
      <Skeleton height={16} width="30%" className="mb-3" />
      
      {/* 내용 */}
      <Skeleton height={16} width="100%" className="mb-2" />
      <Skeleton height={16} width="80%" />
    </div>
  );
};

/**
 * 요약 리스트 스켈레톤
 */
export const SkeletonSummaryList = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonSummaryItem key={index} />
      ))}
    </div>
  );
};
```

---

### `src/components/skeletons/index.ts`

```typescript
export { Skeleton, SkeletonText } from './SkeletonBase';
export { SkeletonHistoryStats } from './SkeletonHistoryStats';
export { SkeletonLineChart } from './SkeletonLineChart';
export { SkeletonHeatmap } from './SkeletonHeatmap';
export { SkeletonSummaryList } from './SkeletonSummaryList';
```

---

## 에러 컴포넌트

### `src/components/errors/ErrorFallback.tsx`

```typescript
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/Button';
import { ErrorType, type AppError } from '@/utils/errorHandling';
import type { ErrorFallbackProps } from '@/components/boundaries';

/**
 * 기본 에러 폴백 UI
 */
export const ErrorFallback = ({
  error,
  appError,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return <AlertCircle className="w-16 h-16 text-orange-500" />;
      case ErrorType.NOT_FOUND:
        return <AlertCircle className="w-16 h-16 text-gray-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return '네트워크 연결을 확인해주세요';
      case ErrorType.SERVER:
        return '서버에 문제가 생겼어요';
      case ErrorType.NOT_FOUND:
        return '찾을 수 없습니다';
      case ErrorType.UNAUTHORIZED:
        return '로그인이 필요합니다';
      default:
        return '문제가 발생했습니다';
    }
  };

  const getMessage = () => {
    return appError.message;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* 아이콘 */}
      <div className="mb-6">{getIcon()}</div>

      {/* 제목 */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getTitle()}
      </h3>

      {/* 메시지 */}
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {getMessage()}
      </p>

      {/* 액션 버튼들 */}
      <div className="flex gap-3">
        {appError.retryable && (
          <Button
            onClick={resetErrorBoundary}
            variant="primary"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </Button>
        )}

        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          홈으로 가기
        </Button>
      </div>

      {/* 개발 환경에서만 에러 상세 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-gray-500">
            개발자 정보 (프로덕션에서는 숨김)
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};
```

---

### `src/components/errors/index.ts`

```typescript
export { ErrorFallback } from './ErrorFallback';
```

---

## React Query 설정

### `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Router } from './router/Router';
import { classifyError, isRetryableError } from './utils/errorHandling';
import './index.css';

/**
 * React Query 클라이언트 설정
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 에러를 Error Boundary로 전파
      throwOnError: true,
      
      // 재시도 전략
      retry: (failureCount, error) => {
        const appError = classifyError(error);
        
        // 재시도 불가능한 에러는 즉시 실패
        if (!isRetryableError(appError)) {
          return false;
        }
        
        // 최대 3번까지 재시도
        return failureCount < 3;
      },
      
      // 재시도 지연 (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 캐시 시간 설정
      staleTime: 1000 * 60 * 5,  // 5분 - 데이터가 fresh한 시간
      gcTime: 1000 * 60 * 30,     // 30분 - 캐시 보관 시간
      
      // 리페칭 전략
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Mutation 에러는 로컬에서 처리
      throwOnError: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## Application Hooks

### `src/hooks/history/useHistoryStatsData.ts`

```typescript
import { useMemo } from 'react';
import {
  useHistoryAnalysisQuery,
  useAccuracyTrendQuery,
} from '@/services/hooks/history';
import { formatChartDate } from '@/utils/formatChartDate';
import type { HistoryPeriod } from '@/types/history.type';

/**
 * History 페이지의 통계 데이터를 제공하는 훅
 */
export const useHistoryStatsData = (period: HistoryPeriod) => {
  const { data: analysis } = useHistoryAnalysisQuery(period);
  const { data: trend } = useAccuracyTrendQuery(period);

  // 통계 데이터 계산
  const stats = useMemo(() => {
    const currentScore = analysis.averageScore;
    const previousScore = analysis.previousPeriodScore || currentScore;
    const scoreDiff = currentScore - previousScore;

    return {
      summaryCount: analysis.summaryCount,
      averageScore: currentScore,
      consecutiveDays: analysis.consecutiveDays,
      scoreDiff,
      isImproving: scoreDiff > 0,
      grade: calculateGrade(currentScore),
      message: getMotivationMessage(currentScore, scoreDiff),
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
    [trend, period]
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

function getMotivationMessage(score: number, diff: number): string {
  if (diff > 10) return '🎉 대단해요! 크게 발전했어요!';
  if (diff > 0) return '👍 계속 발전하고 있어요!';
  if (diff === 0) return '💪 꾸준히 유지하고 있어요!';
  return '📚 조금만 더 힘내봐요!';
}

function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateVolatility(scores: number[]): number {
  if (scores.length === 0) return 0;
  const avg = calculateAverage(scores);
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) /
    scores.length;
  return Math.sqrt(variance);
}
```

---

### `src/hooks/history/index.ts`

```typescript
export { useHistoryStatsData } from './useHistoryStatsData';
export { useCalendarData } from './useCalendarData';
export { useSummaryListData } from './useSummaryListData';
```

---

## 페이지 컴포넌트

### `src/pages/HistoryPage.tsx` (완전한 예제)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Header,
  SelectBox,
  StatisticCard,
  LineChart,
  SearchBar,
  Toggle,
  SummaryItem,
  Pagination,
  Button,
} from '@/components';
import { AsyncBoundary } from '@/components/boundaries';
import {
  SkeletonHistoryStats,
  SkeletonLineChart,
  SkeletonHeatmap,
  SkeletonSummaryList,
} from '@/components/skeletons';
import { ErrorFallback } from '@/components/errors';
import { BookOpen } from 'lucide-react';
import { useDebounce } from '@/hooks';
import { useHistoryStatsData } from '@/hooks/history';
import type { HistoryPeriod } from '@/types/history.type';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<HistoryPeriod>(7);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLatest, setIsLatest] = useState(true);

  const debouncedSearch = useDebounce(searchValue, 300);

  const dateOptions: { value: HistoryPeriod; label: string }[] = [
    { value: 7, label: '최근 7일' },
    { value: 30, label: '최근 30일' },
    { value: 'all', label: '전체 기간' },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center max-w-6xl mx-auto px-6 py-10">
        {/* 기간 선택 */}
        <div className="w-full flex justify-end mb-6">
          <SelectBox value={period} onChange={setPeriod} options={dateOptions} />
        </div>

        {/* 통계 섹션 - 독립적인 로딩/에러 처리 */}
        <AsyncBoundary
          loadingFallback={<SkeletonHistoryStats />}
          errorFallback={ErrorFallback}
          resetKeys={[period]}
        >
          <HistoryStatsSection period={period} />
        </AsyncBoundary>

        {/* 차트 섹션 - 독립적인 로딩/에러 처리 */}
        <AsyncBoundary
          loadingFallback={<SkeletonLineChart />}
          errorFallback={ErrorFallback}
          resetKeys={[period]}
        >
          <AccuracyChartSection period={period} />
        </AsyncBoundary>

        {/* 학습 기록 섹션 */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-app-gray-800">학습 기록</h2>
            <Toggle
              leftLabel="최신순"
              rightLabel="오래된순"
              onLeftClick={() => {
                setIsLatest(true);
                setCurrentPage(1);
              }}
              onRightClick={() => {
                setIsLatest(false);
                setCurrentPage(1);
              }}
            />
          </div>

          <SearchBar
            placeholder="원문 혹은 작성한 요약으로 검색"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* 요약 리스트 - 독립적인 로딩/에러 처리 */}
          <AsyncBoundary
            loadingFallback={<SkeletonSummaryList />}
            errorFallback={ErrorFallback}
            resetKeys={[currentPage, isLatest, debouncedSearch]}
          >
            <SummaryListSection
              page={currentPage}
              isLatest={isLatest}
              search={debouncedSearch}
              onPageChange={setCurrentPage}
              onItemClick={(id) => navigate(`/analysis/${id}`)}
              onEmpty={() => navigate('/input')}
            />
          </AsyncBoundary>
        </div>
      </main>
    </div>
  );
};

// 각 섹션을 별도 컴포넌트로 분리
// Suspense에 의해 data는 항상 정의되므로 undefined 체크 불필요

const HistoryStatsSection = ({ period }: { period: HistoryPeriod }) => {
  const { stats } = useHistoryStatsData(period);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <StatisticCard type="weekCount" size="lg" value={`${stats.summaryCount}개`} />
      <StatisticCard
        type="accuracy"
        size="lg"
        value={`${stats.averageScore}%`}
        subtitle={stats.message}
      />
      <StatisticCard type="streak" size="lg" value={`${stats.consecutiveDays}일`} />
    </div>
  );
};

const AccuracyChartSection = ({ period }: { period: HistoryPeriod }) => {
  const { chartData, trendAnalysis } = useHistoryStatsData(period);

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-app-gray-800">정확도 추이</h2>
        <span className="text-sm text-app-gray-600">
          평균: {trendAnalysis.average.toFixed(1)}%
        </span>
      </div>
      <div className="h-80">
        <LineChart chartData={chartData} />
      </div>
    </div>
  );
};

const SummaryListSection = ({
  page,
  isLatest,
  search,
  onPageChange,
  onItemClick,
  onEmpty,
}: {
  page: number;
  isLatest: boolean;
  search?: string;
  onPageChange: (page: number) => void;
  onItemClick: (id: number) => void;
  onEmpty: () => void;
}) => {
  const { items, pagination, isEmpty } = useSummaryListData({
    page,
    limit: 5,
    isLatest,
    search: search || undefined,
  });

  if (isEmpty) {
    return (
      <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
        <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
        <p className="text-app-gray-500 mb-4">
          {search ? '검색 결과가 없습니다' : '아직 읽은 글이 없습니다'}
        </p>
        {!search && (
          <Button
            onClick={onEmpty}
            variant="outline"
            className="border-app-blue text-app-blue hover:bg-app-blue-light"
          >
            첫 글 시작하기
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mb-8">
        {items.map((summary) => (
          <SummaryItem
            key={summary.id}
            summary={summary}
            onClick={() => onItemClick(summary.id)}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};
```

---

## 변경 이력

- 2024-11-14: 초안 작성

