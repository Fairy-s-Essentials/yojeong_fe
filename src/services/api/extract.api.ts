import type { ExtractRequest, ExtractResponse } from '@/types/extract.type';
import api from './index';

/**
 * 링크에서 원문 추출
 */
export const extractContent = async (urlData: ExtractRequest): Promise<ExtractResponse> => {
  const { data } = await api.post<ExtractResponse>('/extract', urlData);
  return data;
};
