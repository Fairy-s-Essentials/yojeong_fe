import { Skeleton } from './SkeletonBase';

/**
 * 요약 아이템 스켈레톤 (단일)
 */
const SkeletonSummaryItem = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
      <div className="flex items-start justify-between mb-3">
        {/* 제목 */}
        <Skeleton height={20} width="60%" />
        {/* 점수 */}
        <Skeleton variant="circular" width={48} height={48} />
      </div>

      {/* 날짜 */}
      <Skeleton height={16} width="30%" className="mb-3" />

      {/* 내용 */}
      <Skeleton height={16} width="100%" className="mb-2" />
      <Skeleton height={16} width="80%" />
    </div>
  );
};

/**
 * 요약 리스트 스켈레톤
 */
export const SkeletonSummaryList = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonSummaryItem key={index} />
      ))}
    </div>
  );
};
