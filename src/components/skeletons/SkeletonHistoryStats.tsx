import { Skeleton } from './SkeletonBase';

/**
 * History 페이지 통계 카드 스켈레톤 (3개)
 * - 실제 StatisticCard와 동일한 구조
 */
export const SkeletonHistoryStats = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
          {/* 아이콘 영역 */}
          <div className="flex items-start justify-between mb-4">
            <Skeleton variant="rounded" width={48} height={48} />
          </div>

          {/* 값 (lg size: text-4xl) */}
          <Skeleton height={36} width="50%" className="mb-1" />

          {/* 라벨 (text-sm) */}
          <Skeleton height={20} width="60%" />
        </div>
      ))}
    </div>
  );
};
