import { useMemo } from 'react';
import { ORIGINAL_LENGTH_LIMITS } from '@/constants';

interface UseOriginalValidationProps {
  content: string;
}

export const useOriginalValidation = ({ content }: UseOriginalValidationProps) => {
  const contentLength = useMemo(() => content.trim().length, [content]);

  const minLength = ORIGINAL_LENGTH_LIMITS.MIN;
  const maxLength = ORIGINAL_LENGTH_LIMITS.MAX;

  const isValid = contentLength >= minLength && contentLength <= maxLength;
  const isTooShort = contentLength > 0 && contentLength < minLength;
  const isTooLong = contentLength > maxLength;

  return {
    contentLength,
    isValid,
    isTooShort,
    isTooLong,
    minLength,
    maxLength,
  };
};
