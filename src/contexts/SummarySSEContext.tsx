import { createContext, useContext, useState, useCallback, useRef, type ReactNode, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { SSEStep, SSEStatus } from '@/types/summary.type';
import { getActiveJob, acknowledgeJob as acknowledgeJobApi } from '@/services/api/summary.api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SSEState {
  isProcessing: boolean;
  jobId: string | null;
  status: SSEStatus | null;
  step: SSEStep | null;
  progress: number;
  message: string;
  error: { code: string; message: string } | null;
  resultId: number | null;
  isMinimized: boolean;
  pendingAcknowledgeJobId: string | null;
}

interface SummarySSEContextValue {
  state: SSEState;
  startSSE: (jobId: string) => void;
  stopSSE: () => void;
  clearState: () => void;
  toggleMinimize: () => void;
  acknowledgeJob: () => void;
  hasActiveState: boolean;
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
  pendingAcknowledgeJobId: null,
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

  // Job 확인 처리 — 완료 모달 닫기 또는 히스토리 진입 시 호출
  const acknowledgeJob = useCallback(() => {
    const jobId = state.pendingAcknowledgeJobId;
    if (!jobId) return;

    // UI 즉시 초기화 (API 실패해도 서버에서 10분 후 자동 처리)
    stopSSE();
    setState(initialState);

    acknowledgeJobApi(jobId).catch(() => {});
  }, [state.pendingAcknowledgeJobId, stopSSE]);

  // 상태 초기화
  const clearState = useCallback(() => {
    stopSSE();
    setState(initialState);
  }, [stopSSE]);

  // 최소화 토글
  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const hasActiveState = Boolean(state.jobId);

  // SSE 구독 시작
  const startSSE = useCallback(
    (jobId: string, skipInitialState = false) => {
      stopSSE();

      if (!skipInitialState) {
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
          pendingAcknowledgeJobId: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          jobId,
        }));
      }

      const eventSource = new EventSource(`${API_BASE_URL}/summary/sse/${jobId}`, {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      const currentJobId = jobId;

      // 진행 상황 이벤트
      eventSource.addEventListener('progress', (event) => {
        const data = JSON.parse(event.data);
        if (data.jobId !== currentJobId || eventSourceRef.current !== eventSource) {
          return;
        }
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
        if (data.jobId !== currentJobId || eventSourceRef.current !== eventSource) {
          return;
        }

        stopSSE();

        setState((prev) => ({
          ...prev,
          isProcessing: false,
          status: 'completed',
          step: 'completed',
          progress: 100,
          message: data.message,
          resultId: data.result.resultId,
          pendingAcknowledgeJobId: currentJobId,
        }));

        invalidateQueries();
      });

      // 에러 이벤트 (서버에서 보내는 에러)
      eventSource.addEventListener('error', (event) => {
        if (event instanceof MessageEvent && event.data) {
          const data = JSON.parse(event.data);
          if (data.jobId !== currentJobId || eventSourceRef.current !== eventSource) {
            return;
          }

          stopSSE();

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

      // 스냅샷 이벤트 (재연결 시 현재 상태 복원)
      eventSource.addEventListener('snapshot', (event) => {
        const data = JSON.parse(event.data);
        if (data.jobId !== currentJobId || eventSourceRef.current !== eventSource) {
          return;
        }
        setState((prev) => ({
          ...prev,
          jobId: data.jobId,
          status: data.status,
          step: data.step,
          progress: data.progress,
          message: data.message,
          isProcessing: data.status === 'pending' || data.status === 'processing',
          resultId: data.result?.resultId || prev.resultId || null,
          error: data.error || null,
        }));
      });

      // 연결 에러 처리 (네트워크 등)
      eventSource.onerror = () => {};
    },
    [stopSSE, invalidateQueries],
  );

  // 마운트 시 서버에서 미확인 active job 조회
  useEffect(() => {
    const controller = new AbortController();

    const checkActiveJob = async () => {
      try {
        const job = await getActiveJob(controller.signal);

        if (!job) return; // 활성 job 없음

        if (job.status === 'pending' || job.status === 'processing') {
          // 진행 중 → SSE 재연결하여 실시간 진행률 수신
          startSSE(job.jobId, true);
        } else if (job.status === 'completed') {
          // 완료됐지만 미확인 → 완료 모달 표시 + acknowledge 대기
          setState({
            isProcessing: false,
            jobId: job.jobId,
            status: 'completed',
            step: 'completed',
            progress: 100,
            message: job.message || '요약이 완료되었습니다.',
            error: null,
            resultId: job.result?.resultId || null,
            isMinimized: false,
            pendingAcknowledgeJobId: job.jobId,
          });
          invalidateQueries();
        }
      } catch (error) {
        // AbortController에 의한 취소는 무시
        if (controller.signal.aborted) return;
        console.error('active job 조회 실패:', error);
      }
    };

    checkActiveJob();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SummarySSEContext.Provider
      value={{ state, startSSE, stopSSE, clearState, toggleMinimize, acknowledgeJob, hasActiveState }}
    >
      {children}
    </SummarySSEContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSummarySSE = () => {
  const context = useContext(SummarySSEContext);
  if (!context) {
    throw new Error('useSummarySSE must be used within SummarySSEProvider');
  }
  return context;
};
