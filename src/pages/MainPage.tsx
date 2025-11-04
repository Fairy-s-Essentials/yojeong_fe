import { useNavigate } from "react-router";
import { BookOpen } from "lucide-react";
import { Header, Button, StatisticCard } from "@/components";
import {
  useMainAnalysisQuery,
  useMainRecentSummaryQuery,
} from "@/services/hooks/main";

export const MainPage = () => {
  const navigate = useNavigate();

  const handleWriteButton = () => {
    navigate("/input");
  };

  const { data: mainAnalysis } = useMainAnalysisQuery();
  const { data: mainRecentSummary } = useMainRecentSummaryQuery();

  return (
    <div className="min-h-screen">
      {/* 헤더 영역 */}
      <Header isMainPage />

      <main className="flex flex-col items-center max-w-6xl mx-auto px-6 py-12">
        {/* 상단 새 글 읽기 영역 */}
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-app-gray-800 mb-3">오늘의 글 읽기</h1>
          <p className="text-app-gray-500 mb-8">
            AI보다 먼저 읽고, 더 깊게 이해하세요
          </p>
          <Button
            onClick={handleWriteButton}
            className="px-4 py-6 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <BookOpen className="w-5 h-5 mr-2" />새 글 읽기
          </Button>
        </div>

        {/* 학습 통계 영역 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatisticCard
            type="weekCount"
            value={`${mainAnalysis?.weeklyCount || 0}개`}
          />
          <StatisticCard
            type="accuracy"
            value={`${mainAnalysis?.averageScore || 0}%`}
          />
          <StatisticCard
            type="streak"
            value={`${mainAnalysis?.consecutiveDays || 0}일`}
          />
        </div>

        {/* 최근 요약 기록 영역 */}
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2>최근 기록</h2>
            <button className="text-app-blue hover:text-app-blue-dark cursor-pointer">
              전체 보기 →
            </button>
          </div>

          {/* TODO: 최근 기록이 있을 경우 목록 보여주기 구현 */}
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
      </main>
    </div>
  );
};
