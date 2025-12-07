import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { getDetailSummary, saveLearningNote, saveSummary } from '../api/summary.api';
import type { SaveSummaryProps } from '@/types/summary.type';

/**
 * 요약 저장 (Mutation) - SSE 방식
 * jobId를 반환하며, 쿼리 무효화는 SSE 완료 시 SummarySSEContext에서 처리
 */
export const useSaveSummary = () => {
  return useMutation({
    mutationFn: (data: SaveSummaryProps) => saveSummary(data),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, learningNote }: { id: number; learningNote: string }) => saveLearningNote(id, learningNote),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['detailSummary', variables.id] });
    },
  });
};
