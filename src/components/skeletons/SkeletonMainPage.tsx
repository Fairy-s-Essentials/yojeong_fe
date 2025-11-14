import { SkeletonSummaryList } from './SkeletonSummaryList';
import { Button, StatisticCard } from '@/components';
import { BookOpen } from 'lucide-react';

/**
 * MainPage 스켈레톤 (데이터 로딩 중)
 * - 고정 UI + 통계는 0값으로 표시
 * - 최근 기록만 스켈레톤
 */
export const SkeletonMainPage = () => {
  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-6 py-12">
      {/* 상단 새 글 읽기 영역 - 고정 UI */}
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-app-gray-800 mb-3">오늘의 글 읽기</h1>
        <p className="text-app-gray-500 mb-8">AI보다 먼저 읽고, 더 깊게 이해하세요</p>
        <Button className="px-4 py-6 bg-app-blue text-white rounded-lg shadow-lg cursor-pointer">
          <BookOpen className="w-5 h-5 mr-2" />새 글 읽기
        </Button>
      </div>

      {/* 학습 통계 영역 - 0값으로 실제 UI 표시 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatisticCard type="weekCount" size="sm" value="0개" />
        <StatisticCard type="accuracy" size="sm" value="0%" />
        <StatisticCard type="streak" size="sm" value="0일" />
      </div>

      {/* 최근 요약 기록 영역 - 스켈레톤만 */}
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2>최근 기록</h2>
          <button className="text-app-blue cursor-pointer opacity-50">전체 보기 →</button>
        </div>

        {/* 요약 리스트 스켈레톤 */}
        <SkeletonSummaryList count={1} />
      </div>
    </div>
  );
};

