import { useMutation } from "@tanstack/react-query";
import { saveSummary } from "../api/summary.api";

export const useSaveSummary = () => {
  return useMutation({
    mutationFn: saveSummary,
  });
};
