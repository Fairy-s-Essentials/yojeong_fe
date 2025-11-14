import { SkeletonHistoryStats } from './SkeletonHistoryStats';
import { SkeletonLineChart } from './SkeletonLineChart';
import { SkeletonHeatmap } from './SkeletonHeatmap';
import { SkeletonSummaryList } from './SkeletonSummaryList';
import { Skeleton } from './SkeletonBase';

/**
 * HistoryPage 전체 스켈레톤
 * - 모든 쿼리가 병렬로 로드되므로 전체 페이지 스켈레톤 표시
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

      {/* 학습 기록 헤더 */}
      <div className="mb-6 w-full flex flex-col gap-6">
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width={100} height={28} />
            <Skeleton width={180} height={40} className="rounded-full" />
          </div>

          <Skeleton width="100%" height={48} className="rounded-lg" />
        </div>

        {/* 요약 리스트 */}
        <div className="space-y-4 mb-8">
          <SkeletonSummaryList />
          {/* 페이지네이션 */}
          <div className="flex justify-center gap-2">
            <Skeleton width={80} height={40} />
          </div>
        </div>
      </div>
    </>
  );
};
