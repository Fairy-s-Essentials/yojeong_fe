import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { Router } from '@router/Router';
import { LoadingProvider } from '@/contexts';
import { AuthProvider } from '@/contexts';
import { classifyError, isRetryableError, ErrorType } from '@/utils/errorHandling';

/**
 * React Query 클라이언트 설정
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 에러를 Error Boundary로 전파 (단, 401은 제외)
      throwOnError: (error) => {
        const appError = classifyError(error);
        // 401 Unauthorized는 Error Boundary로 보내지 않음
        // 로그인 필요 상황은 로컬에서 처리
        if (appError.type === ErrorType.UNAUTHORIZED) {
          return false;
        }
        return true;
      },

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
      staleTime: 1000 * 60 * 5, // 5분 - 데이터가 fresh한 시간
      gcTime: 1000 * 60 * 30, // 30분 - 캐시 보관 시간

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AuthProvider>
          <Toaster position="top-center" richColors closeButton />
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  </StrictMode>,
);
