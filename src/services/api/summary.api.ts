import type { SaveSummaryProps } from "@/types/summary.type";
import api from ".";

export const saveSummary = async (inputData: SaveSummaryProps) => {
  const { data } = await api.post("/summary", inputData);
  return data.data;
};
