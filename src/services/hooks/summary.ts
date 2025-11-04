import { useMutation, useQuery } from "@tanstack/react-query";
import { getDetailSummary, saveSummary } from "../api/summary.api";

export const useSaveSummary = () => {
  return useMutation({
    mutationFn: saveSummary,
  });
};

export const useGetDetailSummary = (id: number) => {
  return useQuery({
    queryKey: ["detailSummary", id],
    queryFn: () => getDetailSummary(id),
  });
};
