import { useNavigate } from 'react-router';
import { Loader2, X, AlertCircle, CheckCircle2, Minimize2, Maximize2 } from 'lucide-react';
import { useSummarySSE } from '@/contexts';
import Button from './Button';

/**
 * SSE 진행 상황을 표시하는 플로팅 모달 컴포넌트
 * - 진행 중: 프로그레스 바와 메시지 표시
 * - 완료: 결과 확인 버튼 표시
 * - 에러: 에러 메시지 표시
 * - 최소화 가능
 */
export const SSEProgressModal = () => {
  const navigate = useNavigate();
  const { state, clearState, toggleMinimize, hasActiveState } = useSummarySSE();

  if (!hasActiveState) return null;

  // 최소화된 상태 - 우측 하단 작은 버튼
  if (state.isMinimized) {
    return (
      <button
        onClick={toggleMinimize}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border border-app-blue/20 rounded-full shadow-lg px-4 py-3 hover:shadow-xl transition-shadow cursor-pointer"
      >
        {state.isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 text-app-blue animate-spin" />
            <span className="text-app-gray-700 font-medium">{state.progress}%</span>
          </>
        ) : state.status === 'completed' ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">분석 완료!</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-600 font-medium">오류 발생</span>
          </>
        )}
        <Maximize2 className="w-4 h-4 text-app-gray-400 ml-1" />
      </button>
    );
  }

  // 에러 상태
  if (state.error) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
        <div className="bg-white border border-red-200 rounded-xl shadow-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">분석 중 오류가 발생했습니다</p>
              <p className="text-red-600 text-sm mt-1">{state.error.message}</p>
            </div>
            <button onClick={clearState} className="text-red-400 hover:text-red-600 cursor-pointer" aria-label="닫기">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={clearState}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 완료 상태
  if (state.status === 'completed' && state.resultId) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
        <div className="bg-white border border-green-200 rounded-xl shadow-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-green-700 font-medium">분석이 완료되었습니다!</p>
                <p className="text-green-600 text-sm">결과를 확인해보세요</p>
              </div>
            </div>
            <button onClick={toggleMinimize} className="text-app-gray-400 hover:text-app-gray-600 cursor-pointer">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={clearState}
              variant="outline"
              className="flex-1 border-app-gray-200 text-app-gray-600 hover:bg-app-gray-50 cursor-pointer"
            >
              닫기
            </Button>
            <Button
              onClick={() => {
                navigate(`/analysis/${state.resultId}`);
                clearState();
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            >
              결과 확인하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 진행 중 상태
  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <div className="bg-white border border-app-blue/20 rounded-xl shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-app-blue animate-spin" />
            <p className="text-app-gray-800 font-medium">AI가 요약을 분석하고 있어요</p>
          </div>
          <button onClick={toggleMinimize} className="text-app-gray-400 hover:text-app-gray-600 cursor-pointer">
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-app-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-app-blue rounded-full transition-all duration-500 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-app-gray-500">{state.message}</span>
            <span className="text-app-blue font-medium">{state.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
