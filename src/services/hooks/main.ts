import { useQuery } from "@tanstack/react-query";
import { getMainAnalysis, getMainRecentSummary } from "../api/main.api";

export const useMainAnalysisQuery = () => {
  return useQuery({
    queryKey: ["mainAnalysis"],
    queryFn: getMainAnalysis,
  });
};

export const useMainRecentSummaryQuery = () => {
  return useQuery({
    queryKey: ["mainRecentSummary"],
    queryFn: getMainRecentSummary,
  });
};
