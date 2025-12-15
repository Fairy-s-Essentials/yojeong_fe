import { createContext, useContext, useState, useCallback, useRef, type ReactNode, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { SSEStep, SSEStatus } from '@/types/summary.type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = 'active-sse-job-id';

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
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, [stopSSE]);

  // 최소화 토글
  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // 표시할 상태가 있는지 (진행 중, 완료, 에러)
  // const hasActiveState = state.isProcessing || state.status === 'completed' || state.error !== null;
  const hasActiveState = Boolean(state.jobId);

  // SSE 구독 시작
  // const startSSE = useCallback(
  //   (jobId: string) => {
  //     // 기존 연결 정리
  //     stopSSE();

  //     setState({
  //       isProcessing: true,
  //       jobId,
  //       status: 'pending',
  //       step: 'validation',
  //       progress: 0,
  //       message: 'AI가 요약을 분석하고 있어요...',
  //       error: null,
  //       resultId: null,
  //       isMinimized: false,
  //     });

  //     const eventSource = new EventSource(`${API_BASE_URL}/summary/sse/${jobId}`, {
  //       withCredentials: true,
  //     });
  //     eventSourceRef.current = eventSource;

  //     // 진행 상황 이벤트
  //     eventSource.addEventListener('progress', (event) => {
  //       const data = JSON.parse(event.data);
  //       setState((prev) => ({
  //         ...prev,
  //         status: data.status,
  //         step: data.step,
  //         progress: data.progress,
  //         message: data.message,
  //       }));
  //     });

  //     // 완료 이벤트
  //     eventSource.addEventListener('completed', (event) => {
  //       const data = JSON.parse(event.data);
  //       eventSource.close();
  //       eventSourceRef.current = null;

  //       setState((prev) => ({
  //         ...prev,
  //         isProcessing: false,
  //         status: 'completed',
  //         step: 'completed',
  //         progress: 100,
  //         message: data.message,
  //         resultId: data.result.resultId,
  //       }));

  //       // 쿼리 무효화
  //       invalidateQueries();
  //     });

  //     // 에러 이벤트 (서버에서 보내는 에러)
  //     eventSource.addEventListener('error', (event) => {
  //       // MessageEvent 타입인 경우 (서버에서 보낸 에러)
  //       if (event instanceof MessageEvent && event.data) {
  //         const data = JSON.parse(event.data);
  //         eventSource.close();
  //         eventSourceRef.current = null;

  //         setState((prev) => ({
  //           ...prev,
  //           isProcessing: false,
  //           status: 'failed',
  //           step: 'failed',
  //           progress: 0,
  //           message: data.message,
  //           error: data.error,
  //         }));
  //       }
  //     });

  //     // 연결 에러 처리 (네트워크 등)
  //     eventSource.onerror = () => {
  //       // readyState가 CLOSED(2)인 경우에만 에러 처리
  //       if (eventSource.readyState === EventSource.CLOSED) {
  //         eventSource.close();
  //         eventSourceRef.current = null;

  //         setState((prev) => ({
  //           ...prev,
  //           isProcessing: false,
  //           status: 'failed',
  //           step: 'failed',
  //           progress: 0,
  //           message: '연결이 끊어졌습니다.',
  //           error: { code: 'CONNECTION_ERROR', message: '연결이 끊어졌습니다.' },
  //         }));
  //       }
  //     };
  //   },
  //   [stopSSE, invalidateQueries],
  // );
  const startSSE = useCallback(
    (jobId: string, skipInitialState = false) => {
      // 기존 연결 정리
      stopSSE();
      console.log('startSSE', jobId, 'skipInitialState:', skipInitialState);

      // 재연결 시에는 초기 상태 설정을 건너뛰고 snapshot 이벤트에서 상태를 받음
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
        });
      } else {
        // 재연결 시에는 jobId만 먼저 설정 (snapshot에서 나머지 상태 받음)
        setState((prev) => ({
          ...prev,
          jobId,
        }));
      }
      // localStorage에 jobId만 저장 (재연결 시에는 덮어쓰지 않음)
      if (!skipInitialState) {
        localStorage.setItem(STORAGE_KEY, jobId);
      }

      const eventSource = new EventSource(`${API_BASE_URL}/summary/sse/${jobId}`, {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      // 현재 jobId를 클로저로 저장 (이벤트 리스너에서 검증용)
      const currentJobId = jobId;

      // 진행 상황 이벤트
      eventSource.addEventListener('progress', (event) => {
        const data = JSON.parse(event.data);
        // 현재 jobId와 연결 상태 확인
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
        // 현재 jobId와 연결 상태 확인
        if (data.jobId !== currentJobId || eventSourceRef.current !== eventSource) {
          return;
        }
        // localStorage의 jobId 확인
        const storedJobId = localStorage.getItem(STORAGE_KEY);
        if (storedJobId !== currentJobId) {
          return;
        }

        stopSSE();
        // completed 이벤트에서만 localStorage 삭제
        localStorage.removeItem(STORAGE_KEY);

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
          // 현재 jobId와 연결 상태 확인
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
        // 현재 jobId와 연결 상태 확인
        if (data.jobId !== currentJobId || eventSourceRef.current !== eventSource) {
          return;
        }
        console.log('snapshot 이벤트 수신:', data);
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
      eventSource.onerror = () => {
        // // readyState가 CLOSED(2)인 경우에만 에러 처리
        // if (eventSource.readyState === EventSource.CLOSED) {
        //   stopSSE();
        //   setState((prev) => ({
        //     ...prev,
        //     isProcessing: false,
        //     status: 'failed',
        //     step: 'failed',
        //     progress: 0,
        //     message: '연결이 끊어졌습니다.',
        //     error: { code: 'CONNECTION_ERROR', message: '연결이 끊어졌습니다.' },
        //   }));
        // }
      };
    },
    [stopSSE, invalidateQueries],
  );

  // 페이지 리로드 시 재연결 (마운트 시 한 번만 실행)
  useEffect(() => {
    const storedJobId = localStorage.getItem(STORAGE_KEY);
    console.log('페이지 리로드 감지, storedJobId:', storedJobId);

    if (!storedJobId) return;

    const controller = new AbortController();

    const restoreJobState = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/summary/job/${storedJobId}`, {
          credentials: 'include',
          signal: controller.signal,
        });

        if (res.status === 404) {
          const finalStoredJobId = localStorage.getItem(STORAGE_KEY);
          if (finalStoredJobId === storedJobId) {
            console.log('서버에 job이 없음(404), 로컬스토리지 제거');
            localStorage.removeItem(STORAGE_KEY);
          }
          return;
        }

        if (!res.ok) {
          console.warn('job 상태 확인 실패 (status):', res.status);
          return;
        }

        const response = await res.json();
        const job = response?.data || response; // 응답 구조에 따라 조정

        // localStorage의 jobId가 변경되었는지 확인
        const currentStoredJobId = localStorage.getItem(STORAGE_KEY);
        if (currentStoredJobId !== storedJobId) {
          console.log('localStorage jobId가 변경됨, 재연결 중단:', currentStoredJobId);
          return;
        }

        if (!job) {
          // 서버에 job 없음 → localStorage 제거
          const finalStoredJobId = localStorage.getItem(STORAGE_KEY);
          if (finalStoredJobId === storedJobId) {
            console.log('서버에 job이 없음, 로컬스토리지 제거');
            localStorage.removeItem(STORAGE_KEY);
          }
          return;
        }

        console.log('job 상태 확인:', job.status);

        // 진행 중인 job만 재연결 (snapshot 이벤트로 상태 복원)
        if (job.status === 'pending' || job.status === 'processing') {
          // 다시 한 번 localStorage 확인
          const finalStoredJobId = localStorage.getItem(STORAGE_KEY);
          if (finalStoredJobId !== storedJobId) {
            console.log('재연결 직전 localStorage jobId 변경됨, 재연결 중단:', finalStoredJobId);
            return;
          }
          console.log('진행 중인 job 재연결:', storedJobId);
          startSSE(storedJobId, true); // skipInitialState=true로 snapshot에서 상태 받음
        } else if (job.status === 'completed') {
          // 완료된 작업의 경우 상태만 복원 (SSE 연결 불필요)
          const finalStoredJobId = localStorage.getItem(STORAGE_KEY);
          if (finalStoredJobId !== storedJobId) {
            console.log('완료 상태 복원 직전 localStorage jobId 변경됨, 복원 중단:', finalStoredJobId);
            return;
          }
          console.log('완료된 job 상태 복원:', job);
          setState({
            isProcessing: false,
            jobId: storedJobId,
            status: 'completed',
            step: 'completed',
            progress: 100,
            message: job.message || '요약이 완료되었습니다.',
            error: null,
            resultId: job.result?.resultId || job.resultId || null,
            isMinimized: false,
          });
          // 완료된 작업은 로컬스토리지 유지 (사용자가 결과 확인 가능)
        } else if (job.status === 'failed') {
          // 실패한 작업의 경우 상태만 복원
          const finalStoredJobId = localStorage.getItem(STORAGE_KEY);
          if (finalStoredJobId !== storedJobId) {
            console.log('실패 상태 복원 직전 localStorage jobId 변경됨, 복원 중단:', finalStoredJobId);
            return;
          }
          console.log('실패한 job 상태 복원:', job);
          setState({
            isProcessing: false,
            jobId: storedJobId,
            status: 'failed',
            step: 'failed',
            progress: 0,
            message: job.message || '요약 처리에 실패했습니다.',
            error: job.error || { code: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.' },
            resultId: null,
            isMinimized: false,
          });
          // 실패한 작업도 로컬스토리지 유지 (사용자가 에러 확인 가능)
        } else {
          // 알 수 없는 상태 → 로컬스토리지 제거 (하지만 다시 확인)
          const finalStoredJobId = localStorage.getItem(STORAGE_KEY);
          if (finalStoredJobId === storedJobId) {
            console.log('알 수 없는 job 상태, 로컬스토리지 제거');
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('job 상태 확인 요청이 중단되었습니다.');
          return;
        }
        console.error('job 상태 확인 실패:', error);
      }
    };

    restoreJobState();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 마운트 시 한 번만 실행

  return (
    <SummarySSEContext.Provider value={{ state, startSSE, stopSSE, clearState, toggleMinimize, hasActiveState }}>
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
