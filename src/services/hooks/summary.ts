import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getDetailSummary, saveLearningNote, saveSummary } from '../api/summary.api';
import type { SaveSummaryProps } from '@/types/summary.type';

/**
 * 요약 저장 (Mutation)
 */
export const useSaveSummary = () => {
  return useMutation({
    mutationFn: ({ data, signal }: { data: SaveSummaryProps; signal?: AbortSignal }) => saveSummary(data, signal),
  });
};

/**
 * 요약 상세 정보 조회 (Suspense 지원)
 */
export const useGetDetailSummary = (id: number) => {
  return useSuspenseQuery({
    queryKey: ['detailSummary', id],
    queryFn: () => getDetailSummary(id),
  });
};

/**
 * 학습 노트 저장 (Mutation)
 */
export const useSaveLearningNote = () => {
  return useMutation({
    mutationFn: ({ id, learningNote }: { id: number; learningNote: string }) => saveLearningNote(id, learningNote),
  });
};
