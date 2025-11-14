import { Skeleton } from './SkeletonBase';

/**
 * 라인 차트 스켈레톤
 */
export const SkeletonLineChart = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      {/* 제목 */}
      <Skeleton height={24} width={120} className="mb-6" />

      {/* 차트 영역 - 막대 형태로 표시 */}
      <div className="h-80 flex items-end justify-between gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} width="100%" height={`${Math.random() * 60 + 40}%`} className="flex-1" />
        ))}
      </div>
    </div>
  );
};
