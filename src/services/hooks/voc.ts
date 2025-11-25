import { useMutation } from '@tanstack/react-query';
import { submitVoc } from '../api/voc.api';
import type { VocRequest } from '@/types/voc.type';

/**
 * VOC 제출 Mutation
 */
export const useSubmitVocMutation = () => {
  return useMutation({
    mutationFn: (vocData: VocRequest) => submitVoc(vocData),
  });
};
