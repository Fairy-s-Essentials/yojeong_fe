import type { DetailSummary, SaveSummaryProps } from "@/types/summary.type";
import api from ".";

export const saveSummary = async (inputData: SaveSummaryProps) => {
  const { data } = await api.post("/summary", inputData);
  return data.data;
};

export const getDetailSummary = async (
  resultId: number
): Promise<DetailSummary> => {
  const { data } = await api.get(`/summary/${resultId}`);
  return data.data;
};
