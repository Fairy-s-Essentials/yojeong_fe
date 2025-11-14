import { Component, type ReactNode } from 'react';
import { classifyError, logError, type AppError } from '@/utils/errorHandling';
import { DefaultErrorFallback } from './DefaultErrorFallback';

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
 *
 * @example
 * <ErrorBoundary fallback={ErrorFallback} onReset={() => queryClient.resetQueries()}>
 *   <MyComponent />
 * </ErrorBoundary>
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
    if (hasError && resetKeys && prevProps.resetKeys && !areArraysEqual(prevProps.resetKeys, resetKeys)) {
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
      const FallbackComponent = Fallback || DefaultErrorFallback;

      return <FallbackComponent error={error} appError={appError} resetErrorBoundary={this.reset} />;
    }

    return children;
  }
}

function areArraysEqual(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}
