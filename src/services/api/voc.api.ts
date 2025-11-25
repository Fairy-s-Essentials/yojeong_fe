import type { VocRequest, VocResponse } from '@/types/voc.type';
import api from './index';

/**
 * VOC(Voice of Customer) 제출
 */
export const submitVoc = async (vocData: VocRequest): Promise<VocResponse> => {
  const { data } = await api.post<VocResponse>('/voc', vocData);
  return data;
};
