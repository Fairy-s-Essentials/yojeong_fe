import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import type { DetailSummary, SaveSummaryFeedbackProps, SaveSummaryProps } from '@/types/summary.type';
import { getDetailSummary, saveLearningNote, saveSummary, saveSummaryFeedback } from '../api/summary.api';

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

/**
 * 분석 결과 피드백 저장 (좋아요/싫어요/취소)
 */
export const useSaveSummaryFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveSummaryFeedbackProps) => saveSummaryFeedback(data),
    onMutate: async ({ id, reaction }) => {
      const queryKey = ['detailSummary', id];

      await queryClient.cancelQueries({ queryKey });
      const previousSummary = queryClient.getQueryData<DetailSummary>(queryKey);

      queryClient.setQueryData<DetailSummary>(queryKey, (old) =>
        old
          ? {
              ...old,
              feedbackReaction: reaction,
            }
          : old,
      );

      return { previousSummary };
    },
    onError: (_, variables, context) => {
      if (context?.previousSummary) {
        queryClient.setQueryData(['detailSummary', variables.id], context.previousSummary);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['detailSummary', variables.id] });
    },
  });
};
