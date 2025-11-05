import type { DetailSummary, SaveSummaryProps } from "@/types/summary.type";
import api from ".";

export const saveSummary = async (
  inputData: SaveSummaryProps,
  signal?: AbortSignal
) => {
  const { data } = await api.post("/summary", inputData, { signal });
  return data.data;
};

export const getDetailSummary = async (
  resultId: number
): Promise<DetailSummary> => {
  const { data } = await api.get(`/summary/${resultId}`);
  return data.data;
};
