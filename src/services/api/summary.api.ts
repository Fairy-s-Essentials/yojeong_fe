import type { DetailSummary, SaveSummaryProps, SaveSummaryResponse } from '@/types/summary.type';
import api from '.';

/**
 * 요약 저장 요청 - SSE 방식으로 변경
 * jobId를 반환하며, 실제 처리 결과는 SSE로 수신
 */
export const saveSummary = async (inputData: SaveSummaryProps): Promise<SaveSummaryResponse> => {
  const { data } = await api.post('/summary', inputData);
  return data.data; // { jobId: string }
};

export const getDetailSummary = async (resultId: number): Promise<DetailSummary> => {
  const { data } = await api.get(`/summary/${resultId}`);
  return data.data;
};

export const saveLearningNote = async (id: number, learningNote: string) => {
  const { data } = await api.post(`/summary/learning-note`, { id, learningNote });
  return data.data;
};
