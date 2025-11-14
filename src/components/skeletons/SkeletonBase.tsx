import { cn } from '@/utils/cn';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'rounded' | 'circular' | 'rectangular';
}

/**
 * 기본 스켈레톤 컴포넌트
 *
 * @example
 * <Skeleton width={100} height={20} />
 * <Skeleton width="100%" height="50px" variant="circular" />
 */
export const Skeleton = ({ width, height, className, variant = 'rounded' }: SkeletonProps) => {
  const variantStyles = {
    rounded: 'rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn('bg-gray-200 animate-pulse', variantStyles[variant], className)}
      style={style}
      role="status"
      aria-label="로딩 중"
    />
  );
};

/**
 * 텍스트 스켈레톤 (여러 줄)
 *
 * @example
 * <SkeletonText lines={3} />
 */
export const SkeletonText = ({ lines = 1, className }: { lines?: number; className?: string }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} height={16} width={index === lines - 1 ? '80%' : '100%'} />
      ))}
    </div>
  );
};
