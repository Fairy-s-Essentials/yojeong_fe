import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { getDetailSummary, saveLearningNote, saveSummary } from '../api/summary.api';
import type { SaveSummaryProps } from '@/types/summary.type';

/**
 * 요약 저장 (Mutation)
 */
export const useSaveSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, signal }: { data: SaveSummaryProps; signal?: AbortSignal }) => saveSummary(data, signal),
    onSuccess: () => {
      // 메인 페이지 데이터 invalidate
      queryClient.invalidateQueries({ queryKey: ['mainAnalysis'] });
      queryClient.invalidateQueries({ queryKey: ['mainRecentSummary'] });

      // 히스토리 페이지 데이터 invalidate
      queryClient.invalidateQueries({ queryKey: ['historyAnalysis'] });
      queryClient.invalidateQueries({ queryKey: ['accuracyTrend'] });
      queryClient.invalidateQueries({ queryKey: ['calendarYears'] });
      queryClient.invalidateQueries({ queryKey: ['calendarData'] });
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
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
      // 해당 요약 상세 정보 invalidate
      queryClient.invalidateQueries({ queryKey: ['detailSummary', variables.id] });
    },
  });
};
