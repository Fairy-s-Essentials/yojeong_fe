import { useMemo } from 'react';
import { SUMMARY_LENGTH_LIMITS, CRITICAL_LENGTH_LIMITS } from '@/constants/summary';

interface UseSummaryValidationProps {
  originalLength: number;
  summary: string;
  weakness: string;
  opposite: string;
}

export const useSummaryValidation = ({ originalLength, summary, weakness, opposite }: UseSummaryValidationProps) => {
  const maxSummaryLength = useMemo(() => {
    if (originalLength <= SUMMARY_LENGTH_LIMITS.SHORT.ORIGINAL) {
      return SUMMARY_LENGTH_LIMITS.SHORT.SUMMARY;
    }
    if (originalLength <= SUMMARY_LENGTH_LIMITS.MEDIUM.ORIGINAL) {
      return SUMMARY_LENGTH_LIMITS.MEDIUM.SUMMARY;
    }
    return SUMMARY_LENGTH_LIMITS.LONG.SUMMARY;
  }, [originalLength]);

  const summaryLength = summary.trim().length;
  const isSummaryOverLimit = summaryLength > maxSummaryLength;
  const isWeaknessOverLimit = weakness.trim().length > CRITICAL_LENGTH_LIMITS;
  const isOppositeOverLimit = opposite.trim().length > CRITICAL_LENGTH_LIMITS;
  const canSubmit = summaryLength > 0 && !isSummaryOverLimit && !isWeaknessOverLimit && !isOppositeOverLimit;

  return {
    maxSummaryLength,
    summaryLength,
    isSummaryOverLimit,
    isWeaknessOverLimit,
    isOppositeOverLimit,
    canSubmit,
  };
};
