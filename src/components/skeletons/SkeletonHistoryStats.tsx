import { Skeleton } from './SkeletonBase';

/**
 * History 페이지 통계 카드 스켈레톤 (3개)
 */
export const SkeletonHistoryStats = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
          {/* 아이콘 */}
          <Skeleton variant="circular" width={48} height={48} className="mb-4" />

          {/* 값 */}
          <Skeleton height={32} width="60%" className="mb-2" />

          {/* 라벨 */}
          <Skeleton height={20} width="40%" />
        </div>
      ))}
    </div>
  );
};
