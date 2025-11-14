import { Skeleton } from './SkeletonBase';

/**
 * 히트맵 스켈레톤
 */
export const SkeletonHeatmap = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full overflow-hidden">
      <h2 className="text-app-gray-800 mb-6">
        <Skeleton height={24} width={120} />
      </h2>

      <div className="flex gap-6">
        {/* 히트맵 영역 */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-flex gap-1 min-w-min">
            {Array.from({ length: 53 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <Skeleton key={dayIndex} width={12} height={12} variant="rounded" />
                ))}
              </div>
            ))}
          </div>
          {/* 하단 범례 */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton height={16} width={60} />
            <div className="flex items-center gap-2">
              <Skeleton height={12} width={40} />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width={12} height={12} variant="rounded" />
              ))}
              <Skeleton height={12} width={40} />
            </div>
          </div>
        </div>

        {/* 년도 버튼 영역 */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width={80} height={32} className="rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};
