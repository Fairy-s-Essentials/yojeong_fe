import { useMutation } from '@tanstack/react-query';
import { extractContent } from '../api/extract.api';
import type { ExtractRequest } from '@/types/extract.type';

/**
 * 원문 추출 Mutation
 */
export const useExtractContentMutation = () => {
  return useMutation({
    mutationFn: (urlData: ExtractRequest) => extractContent(urlData),
  });
};
