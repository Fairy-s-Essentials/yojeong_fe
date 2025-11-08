import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LEARNING_LENGTH_LIMITS } from '@/constants';
import { Header, AccuracyResult, Button, SummaryBox, FeedBackBox, TextArea } from '@/components';
import { useGetDetailSummary } from '@/services/hooks/summary';
import { useLoading } from '@/contexts';

export const AnalysisPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { hideLoading } = useLoading();

  const { data: detailSummary, isLoading, isError } = useGetDetailSummary(parseInt(id!));
  console.log(detailSummary);

  const [learningNote, setLearningNote] = useState<string>('');
  const isLearningNoteOverLimit = learningNote.length > LEARNING_LENGTH_LIMITS;

  // 로딩 상태 및 에러 처리
  useEffect(() => {
    if (isError) {
      hideLoading();
      alert('분석 결과를 불러오는데 실패했습니다.');
      navigate('/');
    }
  }, [isError, navigate, hideLoading]);

  // 데이터 로딩 완료 시 로딩 모달 숨기기
  useEffect(() => {
    if (detailSummary) {
      hideLoading();
      setLearningNote(detailSummary.learningNote || '');
    }
  }, [detailSummary, hideLoading]);

  const handleGoBack = () => {
    navigate('/');
  };

  // TODO: 완료 버튼 클릭 시 배운 점 저장 api 호출 필요
  const handleComplete = () => {
    navigate('/');
  };

  // 로딩 중이거나 데이터가 없으면 빈 화면 (전역 로딩 모달 표시됨)
  if (isLoading || !detailSummary) return null;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
        {/* 정확도 점수 영역 */}
        <div className="w-full flex flex-col">
          <AccuracyResult score={detailSummary.similarityScore} average={detailSummary.averageScore} />
        </div>

        {/* 요약 비교 영역 */}
        <div className="mb-12">
          <h2 className="text-lg text-app-gray-800 mb-6">📝 요약 비교</h2>
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
          <div className="flex justify-end items-center mt-2">
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
      </main>
    </div>
  );
};
