import { Skeleton } from './SkeletonBase';

/**
 * 히트맵 스켈레톤
 */
export const SkeletonHeatmap = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      {/* 제목과 년도 선택 */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton height={24} width={120} />
        <Skeleton height={32} width={100} />
      </div>

      {/* 히트맵 그리드 */}
      <div className="space-y-1">
        {Array.from({ length: 7 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {Array.from({ length: 53 }).map((_, dayIndex) => (
              <Skeleton key={dayIndex} width={12} height={12} variant="rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
