import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LEARNING_LENGTH_LIMITS } from '@/constants';
import { AccuracyResult, Button, SummaryBox, FeedBackBox, TextArea, OriginalTextModal } from '@/components';
import { AsyncBoundary } from '@/components/boundaries';
import { ErrorFallback } from '@/components/errors';
import { SkeletonAnalysisPage } from '@/components/skeletons';
import { useGetDetailSummary, useSaveLearningNote } from '@/services/hooks/summary';
import { useLoading } from '@/contexts';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const AnalysisPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AsyncBoundary loadingFallback={<SkeletonAnalysisPage />} errorFallback={ErrorFallback} resetKeys={[id]}>
      <AnalysisContent summaryId={parseInt(id!)} />
    </AsyncBoundary>
  );
};

interface AnalysisContentProps {
  summaryId: number;
}

const AnalysisContent = ({ summaryId }: AnalysisContentProps) => {
  const navigate = useNavigate();
  const { hideLoading } = useLoading();

  // useSuspenseQuery - data는 항상 정의됨
  const { data: detailSummary } = useGetDetailSummary(summaryId);
  const { mutate: saveLearningNote } = useSaveLearningNote();

  const [learningNote, setLearningNote] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isOriginalModalOpen, setIsOriginalModalOpen] = useState(false);
  const isLearningNoteOverLimit = learningNote.length > LEARNING_LENGTH_LIMITS;

  // 데이터 로드 완료 시 로딩 모달 숨기기 (컴포넌트 마운트 = Suspense 해결 = 데이터 로드 완료)
  useEffect(() => {
    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  const handleSaveLearningNote = useCallback(() => {
    saveLearningNote(
      { id: summaryId, learningNote },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setTimeout(() => {
            setSaveStatus('idle');
          }, 2000);
        },
        onError: () => {
          setSaveStatus('error');
          setTimeout(() => {
            setSaveStatus('idle');
          }, 3000);
        },
      },
    );
  }, [summaryId, learningNote, saveLearningNote]);

  // 초기 learningNote 설정
  useEffect(() => {
    setLearningNote(detailSummary.learningNote || '');
    setIsInitialLoad(false);
  }, [detailSummary]);

  // 배운점 자동 저장 (debounce 1초)
  useEffect(() => {
    // 초기 로드 시에는 자동 저장하지 않음
    if (isInitialLoad) return;

    // 글자수 초과 시 자동 저장하지 않음
    if (isLearningNoteOverLimit) return;

    setSaveStatus('idle');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      handleSaveLearningNote();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [learningNote, isInitialLoad, isLearningNoteOverLimit, handleSaveLearningNote]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleComplete = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      {/* 정확도 점수 영역 */}
      <div className="w-full flex flex-col">
        <AccuracyResult score={detailSummary.similarityScore} average={detailSummary.averageScore} />
      </div>

      {/* 요약 비교 영역 */}
      <div className="w-full mb-12">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-app-gray-800 mb-6">📝 요약 비교</h2>
          <button
            onClick={() => setIsOriginalModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="text-sm font-medium">원문보기</span>
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-app-gray-800 mb-3">✍️ 당신의 요약</h3>
            <SummaryBox type="user" summary={detailSummary.userSummary} />
          </div>
          <div>
            <h3 className="text-app-gray-800 mb-3">🤖 AI 요약</h3>
            <SummaryBox type="ai" summary={detailSummary.aiSummary} />
          </div>
        </div>
      </div>

      {/* 피드백 영역 */}
      <div className="w-full space-y-6 mb-12">
        <h2 className="text-lg text-app-gray-800">💬 피드백</h2>
        <FeedBackBox type="wellUnderstood" value={detailSummary.aiWellUnderstood} />
        <FeedBackBox type="missedPoint" value={detailSummary.aiMissedPoints} />
        <FeedBackBox type="improvement" value={detailSummary.aiImprovements} />
      </div>

      {/* 배운 점 영역 */}
      <div className="w-full mb-12">
        <h3 className="text-app-gray-800 mb-2">💡 배운 점</h3>
        <p className="text-sm text-app-gray-500 mb-4">이번 글에서 배운 점을 자유롭게 작성하세요.</p>
        <TextArea
          value={learningNote}
          onChange={(e) => setLearningNote(e.target.value)}
          placeholder="예: 이번에는 반대 의견을 놓쳤다. 다음에는 '하지만', '반면' 같은 키워드에 주목하자."
          className={`h-32 resize-none border-dashed border-2 rounded-lg ${
            isLearningNoteOverLimit ? 'border-app-red focus:ring-app-red' : 'border-app-gray-200'
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm">
            {saveStatus === 'saving' && <span className="text-app-gray-500">저장 중...</span>}
            {saveStatus === 'saved' && <span className="text-green-600">✓ 저장 완료</span>}
            {saveStatus === 'error' && <span className="text-app-red">저장 실패</span>}
          </div>
          <div className={`text-sm ${isLearningNoteOverLimit ? 'text-app-red' : 'text-app-gray-400'}`}>
            {learningNote.length} / 1000자
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full flex gap-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex-1 h-12 border-app-gray-200 text-app-gray-500 hover:bg-app-gray-50 rounded-lg cursor-pointer"
        >
          뒤로가기
        </Button>
        <Button
          onClick={handleComplete}
          disabled={isLearningNoteOverLimit}
          className="flex-1 h-12 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLearningNoteOverLimit ? '글자수 초과 (최대 1000자)' : '완료하고 대시보드로 →'}
        </Button>
      </div>

      {/* 원문보기 모달 */}
      <OriginalTextModal
        isOpen={isOriginalModalOpen}
        onClose={() => setIsOriginalModalOpen(false)}
        originalText={detailSummary.originalText || ''}
        originalUrl={detailSummary.originalUrl ?? undefined}
      />
    </div>
  );
};
