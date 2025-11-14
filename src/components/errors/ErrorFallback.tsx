import { AlertCircle, RefreshCw, Home, WifiOff, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/Button';
import { ErrorType } from '@/utils/errorHandling';
import type { ErrorFallbackProps } from '@/components/boundaries';

/**
 * 범용 에러 폴백 UI
 *
 * 에러 타입에 따라 적절한 아이콘, 제목, 메시지를 표시합니다.
 */
export const ErrorFallback = ({ error, appError, resetErrorBoundary }: ErrorFallbackProps) => {
  const navigate = useNavigate();

  // 에러 타입별 아이콘 선택
  const getIcon = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return <WifiOff className="w-16 h-16 text-orange-500" />;
      case ErrorType.UNAUTHORIZED:
        return <Lock className="w-16 h-16 text-blue-500" />;
      case ErrorType.NOT_FOUND:
        return <AlertCircle className="w-16 h-16 text-gray-500" />;
      case ErrorType.SERVER:
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-red-500" />;
    }
  };

  // 에러 타입별 제목
  const getTitle = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return '네트워크 연결을 확인해주세요';
      case ErrorType.SERVER:
        return '서버에 일시적인 문제가 생겼어요';
      case ErrorType.NOT_FOUND:
        return '페이지를 찾을 수 없습니다';
      case ErrorType.UNAUTHORIZED:
        return '로그인이 필요합니다';
      case ErrorType.FORBIDDEN:
        return '접근 권한이 없습니다';
      case ErrorType.VALIDATION:
        return '입력 정보를 확인해주세요';
      default:
        return '문제가 발생했습니다';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* 아이콘 */}
      <div className="mb-6">{getIcon()}</div>

      {/* 제목 */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{getTitle()}</h3>

      {/* 메시지 */}
      <p className="text-gray-600 text-center mb-8 max-w-md">{appError.message}</p>

      {/* 액션 버튼들 */}
      <div className="flex gap-3">
        {appError.retryable && (
          <Button onClick={resetErrorBoundary} className="flex items-center gap-2 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </Button>
        )}

        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2 cursor-pointer">
          <Home className="w-4 h-4" />
          홈으로 가기
        </Button>
      </div>

      {/* 개발 환경에서만 에러 상세 표시 */}
      {import.meta.env.DEV && (
        <details className="mt-8 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            개발자 정보 (프로덕션에서는 숨김)
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">{error.stack}</pre>
        </details>
      )}
    </div>
  );
};
