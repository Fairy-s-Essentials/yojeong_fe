import { useNavigate } from 'react-router';
import { BookOpen } from 'lucide-react';
import { Header, Button, StatisticCard, SummaryItem } from '@/components';
import { AsyncBoundary } from '@/components/boundaries';
import { ErrorFallback } from '@/components/errors';
import { SkeletonMainPage } from '@/components/skeletons';
import { useMainAnalysisQuery, useMainRecentSummaryQuery } from '@/services/hooks/main';
import { useAuth } from '@/hooks/auth/useAuth';

export const MainPage = () => {
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <div className="min-h-screen">
      <Header isMainPage />
      {/* 인증 확인 완료 전까지는 아무것도 표시 안 함 */}
      {!isLoading && (
        <main>
          {isLoggedIn ? (
            <AsyncBoundary loadingFallback={<SkeletonMainPage />} errorFallback={ErrorFallback}>
              <MainContent />
            </AsyncBoundary>
          ) : (
            <MainEmpty />
          )}
        </main>
      )}
    </div>
  );
};

// 로그인한 사용자 콘텐츠
const MainContent = () => {
  const navigate = useNavigate();
  const { data: mainAnalysis } = useMainAnalysisQuery();
  const { data: mainRecentSummary } = useMainRecentSummaryQuery();

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-6 py-12">
      {/* 상단 새 글 읽기 영역 */}
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-app-gray-800 mb-3">오늘의 글 읽기</h1>
        <p className="text-app-gray-500 mb-8">AI보다 먼저 읽고, 더 깊게 이해하세요</p>
        <Button
          onClick={() => navigate('/input')}
          className="px-4 py-6 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5 mr-2" />새 글 읽기
        </Button>
      </div>

      {/* 학습 통계 영역 - useSuspenseQuery로 data 항상 정의됨 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatisticCard type="weekCount" size="sm" value={`${mainAnalysis.weeklyCount}개`} />
        <StatisticCard type="accuracy" size="sm" value={`${mainAnalysis.averageScore}%`} />
        <StatisticCard type="streak" size="sm" value={`${mainAnalysis.consecutiveDays}일`} />
      </div>

      {/* 최근 요약 기록 영역 */}
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2>최근 기록</h2>
          <button
            onClick={() => navigate('/history')}
            className="text-app-blue hover:text-app-blue-dark cursor-pointer"
          >
            전체 보기 →
          </button>
        </div>

        {/* 데이터가 있으면 표시, 없으면 빈 상태 */}
        {mainRecentSummary.length > 0 ? (
          <div className="space-y-4">
            {mainRecentSummary.map((summary) => (
              <SummaryItem key={summary.id} summary={summary} onClick={() => navigate(`/analysis/${summary.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
            <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
            <p className="text-app-gray-500 mb-4">아직 읽은 글이 없습니다</p>
            <Button
              onClick={() => navigate('/input')}
              variant="outline"
              className="border-app-blue text-app-blue hover:bg-app-blue-light cursor-pointer"
            >
              첫 글 시작하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// 비로그인 사용자 콘텐츠
const MainEmpty = () => {
  const { openLoginModal } = useAuth();

  const handleWriteButton = () => {
    openLoginModal();
  };

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-6 py-12">
      {/* 상단 새 글 읽기 영역 */}
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-app-gray-800 mb-3">오늘의 글 읽기</h1>
        <p className="text-app-gray-500 mb-8">AI보다 먼저 읽고, 더 깊게 이해하세요</p>
        <Button
          onClick={handleWriteButton}
          className="px-4 py-6 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5 mr-2" />새 글 읽기
        </Button>
      </div>

      {/* 학습 통계 영역 - 빈 상태 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatisticCard type="weekCount" size="sm" value="0개" />
        <StatisticCard type="accuracy" size="sm" value="0%" />
        <StatisticCard type="streak" size="sm" value="0일" />
      </div>

      {/* 최근 요약 기록 영역 - 빈 상태 */}
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2>최근 기록</h2>
          <button onClick={openLoginModal} className="text-app-blue hover:text-app-blue-dark cursor-pointer">
            전체 보기 →
          </button>
        </div>

        <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
          <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
          <p className="text-app-gray-500 mb-4">아직 읽은 글이 없습니다</p>
          <Button
            onClick={handleWriteButton}
            variant="outline"
            className="border-app-blue text-app-blue hover:bg-app-blue-light cursor-pointer"
          >
            첫 글 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
};
