import type { ErrorFallbackProps } from './ErrorBoundary';

/**
 * 기본 에러 폴백 UI
 *
 * ErrorBoundary에서 fallback이 지정되지 않았을 때 사용됩니다.
 */
export const DefaultErrorFallback = ({ appError, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
        <p className="text-gray-600 mb-4">{appError.message}</p>
        {appError.retryable && (
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};
