import { Skeleton } from './SkeletonBase';

/**
 * 요약 아이템 스켈레톤 (단일)
 * - 실제 SummaryItem과 동일한 구조
 */
const SkeletonSummaryItem = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-app-gray-200">
      <div className="flex items-center justify-between gap-5">
        {/* 왼쪽: 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          {/* 요약 텍스트 */}
          <Skeleton height={20} width="80%" className="mb-1" />

          {/* 날짜 */}
          <Skeleton height={20} width="30%" />
        </div>

        {/* 오른쪽: 점수 원형 */}
        <div className="shrink-0">
          <Skeleton variant="circular" width={56} height={56} />
        </div>
      </div>
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
