import type { AxiosError } from 'axios';

/**
 * 에러 타입 분류
 */
export const ErrorType = {
  NETWORK: 'NETWORK', // 네트워크 연결 문제
  UNAUTHORIZED: 'UNAUTHORIZED', // 인증 필요 (401)
  FORBIDDEN: 'FORBIDDEN', // 권한 없음 (403)
  NOT_FOUND: 'NOT_FOUND', // 리소스 없음 (404)
  SERVER: 'SERVER', // 서버 에러 (5xx)
  VALIDATION: 'VALIDATION', // 입력값 검증 실패 (400)
  UNKNOWN: 'UNKNOWN', // 알 수 없는 에러
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

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
  if (import.meta.env.DEV) {
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
