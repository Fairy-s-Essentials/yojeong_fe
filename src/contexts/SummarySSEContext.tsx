import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { SSEStep, SSEStatus } from '@/types/summary.type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SSEState {
  isProcessing: boolean;
  jobId: string | null;
  status: SSEStatus | null;
  step: SSEStep | null;
  progress: number;
  message: string;
  error: { code: string; message: string } | null;
  resultId: number | null; // 완료 시 결과 ID
  isMinimized: boolean; // 모달 최소화 상태
}

interface SummarySSEContextValue {
  state: SSEState;
  startSSE: (jobId: string) => void;
  stopSSE: () => void;
  clearState: () => void;
  toggleMinimize: () => void;
  hasActiveState: boolean; // 표시할 상태가 있는지
}

const initialState: SSEState = {
  isProcessing: false,
  jobId: null,
  status: null,
  step: null,
  progress: 0,
  message: '',
  error: null,
  resultId: null,
  isMinimized: false,
};

const SummarySSEContext = createContext<SummarySSEContextValue | undefined>(undefined);

export const SummarySSEProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SSEState>(initialState);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  // 쿼리 무효화 함수
  const invalidateQueries = useCallback(() => {
    [
      ['mainAnalysis'],
      ['mainRecentSummary'],
      ['historyAnalysis'],
      ['accuracyTrend'],
      ['calendarYears'],
      ['calendarData'],
      ['summaries'],
    ].forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
  }, [queryClient]);

  // SSE 연결 종료
  const stopSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  // 상태 초기화
  const clearState = useCallback(() => {
    stopSSE();
    setState(initialState);
  }, [stopSSE]);

  // 최소화 토글
  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // 표시할 상태가 있는지 (진행 중, 완료, 에러)
  const hasActiveState = state.isProcessing || state.status === 'completed' || state.error !== null;

  // SSE 구독 시작
  const startSSE = useCallback(
    (jobId: string) => {
      // 기존 연결 정리
      stopSSE();

      setState({
        isProcessing: true,
        jobId,
        status: 'pending',
        step: 'validation',
        progress: 0,
        message: 'AI가 요약을 분석하고 있어요...',
        error: null,
        resultId: null,
        isMinimized: false,
      });

      const eventSource = new EventSource(`${API_BASE_URL}/summary/sse/${jobId}`, {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      // 진행 상황 이벤트
      eventSource.addEventListener('progress', (event) => {
        const data = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          status: data.status,
          step: data.step,
          progress: data.progress,
          message: data.message,
        }));
      });

      // 완료 이벤트
      eventSource.addEventListener('completed', (event) => {
        const data = JSON.parse(event.data);
        eventSource.close();
        eventSourceRef.current = null;

        setState((prev) => ({
          ...prev,
          isProcessing: false,
          status: 'completed',
          step: 'completed',
          progress: 100,
          message: data.message,
          resultId: data.result.resultId,
        }));

        // 쿼리 무효화
        invalidateQueries();
      });

      // 에러 이벤트 (서버에서 보내는 에러)
      eventSource.addEventListener('error', (event) => {
        // MessageEvent 타입인 경우 (서버에서 보낸 에러)
        if (event instanceof MessageEvent && event.data) {
          const data = JSON.parse(event.data);
          eventSource.close();
          eventSourceRef.current = null;

          setState((prev) => ({
            ...prev,
            isProcessing: false,
            status: 'failed',
            step: 'failed',
            progress: 0,
            message: data.message,
            error: data.error,
          }));
        }
      });

      // 연결 에러 처리 (네트워크 등)
      eventSource.onerror = () => {
        // readyState가 CLOSED(2)인 경우에만 에러 처리
        if (eventSource.readyState === EventSource.CLOSED) {
          eventSource.close();
          eventSourceRef.current = null;

          setState((prev) => ({
            ...prev,
            isProcessing: false,
            status: 'failed',
            step: 'failed',
            progress: 0,
            message: '연결이 끊어졌습니다.',
            error: { code: 'CONNECTION_ERROR', message: '연결이 끊어졌습니다.' },
          }));
        }
      };
    },
    [stopSSE, invalidateQueries],
  );

  return (
    <SummarySSEContext.Provider value={{ state, startSSE, stopSSE, clearState, toggleMinimize, hasActiveState }}>
      {children}
    </SummarySSEContext.Provider>
  );
};

export const useSummarySSE = () => {
  const context = useContext(SummarySSEContext);
  if (!context) {
    throw new Error('useSummarySSE must be used within SummarySSEProvider');
  }
  return context;
};
