import { SkeletonHistoryStats } from './SkeletonHistoryStats';
import { SkeletonLineChart } from './SkeletonLineChart';
import { SkeletonHeatmap } from './SkeletonHeatmap';
import { SkeletonSummaryList } from './SkeletonSummaryList';
import { Toggle, SearchBar } from '@/components';

/**
 * HistoryPage 전체 스켈레톤
 * - 고정 UI(제목, 컨트롤)는 실제 컴포넌트로 표시
 * - 동적 데이터만 스켈레톤 처리
 */
export const SkeletonHistoryPage = () => {
  return (
    <>
      {/* 통계 카드 */}
      <SkeletonHistoryStats />

      {/* 차트 */}
      <SkeletonLineChart />

      {/* 히트맵 */}
      <SkeletonHeatmap />

      {/* 학습 기록 헤더 - 고정 UI는 실제로 표시 */}
      <div className="mb-6 w-full flex flex-col gap-6">
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-app-gray-800">학습 기록</h2>
            <Toggle leftLabel="최신순" rightLabel="오래된순" onLeftClick={() => {}} onRightClick={() => {}} />
          </div>

          <SearchBar placeholder="원문 혹은 작성한 요약으로 검색" value="" onChange={() => {}} disabled />
        </div>

        {/* 요약 리스트 */}
        <div className="space-y-4 mb-8">
          <SkeletonSummaryList />
          {/* 페이지네이션은 로딩 후 표시 */}
        </div>
      </div>
    </>
  );
};
