import { Suspense, type ReactNode } from 'react';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

/**
 * React Suspense 래퍼 컴포넌트
 *
 * 비동기 컴포넌트가 로딩 중일 때 fallback UI를 표시합니다.
 *
 * @example
 * <SuspenseBoundary fallback={<LoadingSpinner />}>
 *   <AsyncComponent />
 * </SuspenseBoundary>
 */
export const SuspenseBoundary = ({ children, fallback }: SuspenseBoundaryProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
