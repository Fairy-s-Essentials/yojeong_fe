import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LEARNING_LENGTH_LIMITS } from '@/constants';
import { Header, AccuracyResult, Button, SummaryBox, FeedBackBox, TextArea } from '@/components';

// TODO: 추후 types 폴더의 타입으로 연결
export interface Summary {
  id: number;
  userId: number;
  originalText: string;
  originalUrl: string | null;
  userSummary: string;
  criticalWeakness: string | null;
  criticalOpposite: string | null;
  aiSummary: string;
  similarityScore: number; // 0~100
  aiWellUnderstood: string[];
  aiMissedPoints: string[];
  aiImprovements: string[];
  learningNote: string | null;
  createdAt: string;

  // 사용자의 평균 정확도
  averageScore: number;
}

const dummy: Summary = {
  id: 1,
  userId: 1,
  originalText: '원문',
  originalUrl: null,
  userSummary:
    'AI가 많은 직업을 대체할 것이지만 새로운 기회도 만든다. 중요한 것은 AI와 경쟁이 아니라 활용하는 능력이며, 평생 학습과 인간 고유의 능력 개발이 필요하다.',
  criticalWeakness: null,
  criticalOpposite: null,
  aiSummary:
    'AI 기술 발전으로 직업 대체 우려가 있지만, 역사적으로 새 기술은 새로운 기회도 창출했다. AI 시대에는 AI를 활용하는 능력과 인간 고유의 창의성, 공감 능력이 중요하며, 평생 학습이 필요하다.',
  similarityScore: 80,
  aiWellUnderstood: [
    'AI가 일자리를 대체하면서도 새로운 기회를 만든다는 핵심 주장을 잘 파악했습니다.',
    '평생 학습의 중요성을 언급한 점이 좋습니다.',
  ],
  aiMissedPoints: [
    '산업혁명 시대의 역사적 사례를 언급하지 않았습니다.',
    '소프트 스킬과 기술적 스킬의 균형에 대한 내용이 빠졌습니다.',
  ],
  aiImprovements: [
    '핵심 주장을 뒷받침하는 구체적 사례나 근거를 포함하면 더 설득력 있는 요약이 됩니다.',
    '글의 논리적 흐름(문제제기 → 역사적 사례 → 해결책)을 요약에도 반영해보세요.',
  ],
  learningNote: null,
  createdAt: '2025-10-31',

  // 사용자의 평균 정확도
  averageScore: 0,
};

export const AnalysisPage = () => {
  const navigate = useNavigate();

  const [learningNote, setLearningNote] = useState<string>('');
  const isLearningNoteOverLimit = learningNote.length > LEARNING_LENGTH_LIMITS;

  // TODO: 페이지 히스토리 삭제 필요
  const handleGoBack = () => {
    navigate('/');
  };

  // TODO: 완료 버튼 클릭 시 배운 점 저장 api 호출 필요
  const handleComplete = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
        {/* 정확도 점수 영역 */}
        <div className="w-full flex flex-col">
          <AccuracyResult score={dummy.similarityScore} average={dummy.averageScore} />
        </div>

        {/* 요약 비교 영역 */}
        <div className="mb-12">
          <h2 className="text-lg text-app-gray-800 mb-6">📝 요약 비교</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-app-gray-800 mb-3">✍️ 당신의 요약</h3>
              <SummaryBox type="user" summary={dummy.userSummary} />
            </div>
            <div>
              <h3 className="text-app-gray-800 mb-3">🤖 AI 요약</h3>
              <SummaryBox type="ai" summary={dummy.aiSummary} />
            </div>
          </div>
        </div>

        {/* 피드백 영역 */}
        <div className="w-full space-y-6 mb-12">
          <h2 className="text-lg text-app-gray-800">💬 피드백</h2>
          <FeedBackBox type="wellUnderstood" value={dummy.aiWellUnderstood} />
          <FeedBackBox type="missedPoint" value={dummy.aiMissedPoints} />
          <FeedBackBox type="improvement" value={dummy.aiImprovements} />
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
