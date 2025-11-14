import { Skeleton } from './SkeletonBase';

/**
 * 라인 차트 스켈레톤
 * - 제목은 고정, 차트 데이터만 스켈레톤
 */
export const SkeletonLineChart = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-app-gray-800">정확도 추이</h2>
      </div>

      {/* 차트 영역 - 막대 형태로 표시 */}
      <div className="h-80 flex items-end justify-between gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} width="100%" height={`${Math.random() * 60 + 40}%`} className="flex-1" />
        ))}
      </div>
    </div>
  );
};
