import { type ReactNode } from 'react';
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
 * 비동기 데이터 로딩 시 로딩/에러 상태를 선언적으로 처리합니다.
 *
 * @example
 * <AsyncBoundary
 *   loadingFallback={<SkeletonCard />}
 *   errorFallback={ErrorFallback}
 *   resetKeys={[userId]}
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
          <SuspenseBoundary fallback={loadingFallback}>{children}</SuspenseBoundary>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
