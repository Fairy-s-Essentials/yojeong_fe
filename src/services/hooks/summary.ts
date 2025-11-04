import { useMutation, useQuery } from "@tanstack/react-query";
import { getDetailSummary, saveSummary } from "../api/summary.api";
import type { SaveSummaryProps } from "@/types/summary.type";

export const useSaveSummary = () => {
  return useMutation({
    mutationFn: ({
      data,
      signal,
    }: {
      data: SaveSummaryProps;
      signal?: AbortSignal;
    }) => saveSummary(data, signal),
  });
};

export const useGetDetailSummary = (id: number) => {
  return useQuery({
    queryKey: ["detailSummary", id],
    queryFn: () => getDetailSummary(id),
  });
};
