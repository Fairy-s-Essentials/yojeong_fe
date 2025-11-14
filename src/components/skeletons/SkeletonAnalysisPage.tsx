import { Skeleton } from './SkeletonBase';
import { Button } from '@/components';

/**
 * AnalysisPage 스켈레톤
 * - 고정 레이블/제목은 실제 UI로 표시
 * - 동적 데이터만 스켈레톤 처리
 */
export const SkeletonAnalysisPage = () => {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      {/* 정확도 점수 영역 - 로딩 상태로 0점 표시 */}
      <div className="w-full flex flex-col">
        <div className="bg-linear-to-r from-app-blue to-app-purple rounded-2xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm opacity-80 mb-2">정확도 점수</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl">0</span>
              <span className="text-3xl opacity-80">/100</span>
            </div>
            <div className="flex items-center gap-2 mt-4 opacity-90">
              <p>로딩중입니다..!</p>
            </div>
          </div>
          <div className="absolute top-6 right-6 text-5xl">🎯</div>
        </div>
      </div>

      {/* 요약 비교 영역 */}
      <div className="w-full mb-12">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-app-gray-800 mb-6">📝 요약 비교</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white opacity-50 cursor-not-allowed">
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
          {/* 당신의 요약 */}
          <div>
            <h3 className="text-app-gray-800 mb-3">✍️ 당신의 요약</h3>
            <div className="bg-app-gray-50 border-2 border-app-blue rounded-xl p-5 min-h-[200px] flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="95%" />
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="90%" />
                <Skeleton height={20} width="95%" />
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="85%" />
              </div>
              <div className="text-xs text-app-gray-500 mt-3 text-right">
                <Skeleton height={16} width={50} className="ml-auto" />
              </div>
            </div>
          </div>
          {/* AI 요약 */}
          <div>
            <h3 className="text-app-gray-800 mb-3">🤖 AI 요약</h3>
            <div className="bg-app-gray-50 border-2 border-app-green rounded-xl p-5 min-h-[200px] flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="90%" />
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="95%" />
                <Skeleton height={20} width="90%" />
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="80%" />
              </div>
              <div className="text-xs text-app-gray-500 mt-3 text-right">
                <Skeleton height={16} width={50} className="ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 피드백 영역 - FeedBackBox 스타일 매칭 */}
      <div className="w-full space-y-6 mb-12">
        <h2 className="text-lg text-app-gray-800">💬 피드백</h2>
        {[
          { label: '✅ 잘 파악한 것', boxColor: 'bg-app-green-light border-app-green', textColor: 'text-green-900' },
          { label: '⚠️ 놓친 포인트', boxColor: 'bg-app-orange-light border-app-orange', textColor: 'text-yellow-900' },
          { label: '💡 개선 제안', boxColor: 'bg-app-blue-light border-app-blue', textColor: 'text-blue-900' },
        ].map((feedback, i) => (
          <div key={i} className={`${feedback.boxColor} border-l-4 rounded-lg p-6`}>
            <h3 className={`${feedback.textColor} text-lg mb-3`}>{feedback.label}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span>•</span>
                <Skeleton height={20} width="90%" />
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                <Skeleton height={20} width="85%" />
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* 배운 점 영역 - TextArea 스타일 매칭 */}
      <div className="w-full mb-12">
        <h3 className="text-app-gray-800 mb-2">💡 배운 점</h3>
        <p className="text-sm text-app-gray-500 mb-4">이번 글에서 배운 점을 자유롭게 작성하세요.</p>
        <div className="h-32 resize-none border-dashed border-2 rounded-lg border-app-gray-200 bg-app-gray-50 w-full flex items-center justify-center">
          <Skeleton height={20} width={200} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-app-gray-400">로딩 중...</div>
          <div className="text-sm text-app-gray-400">0 / 1000자</div>
        </div>
      </div>

      {/* 버튼 영역 - 실제 버튼 표시 (disabled 상태) */}
      <div className="w-full flex gap-4">
        <Button
          variant="outline"
          disabled
          className="flex-1 h-12 border-app-gray-200 text-app-gray-500 rounded-lg cursor-not-allowed opacity-50"
        >
          뒤로가기
        </Button>
        <Button disabled className="flex-1 h-12 bg-app-blue text-white rounded-lg cursor-not-allowed opacity-50">
          완료하고 대시보드로 →
        </Button>
      </div>
    </div>
  );
};
