import type { ExtractStatus } from '@/types/extract.type';
import { MESSAGE } from '@/constants/message';

interface ExtractStatusResult {
  isUsable: boolean;
  message: string;
}

const STATUS_MAP: Record<ExtractStatus, ExtractStatusResult> = {
  success: { isUsable: true, message: MESSAGE.EXTRACT.SUCCESS },
  truncated: { isUsable: true, message: MESSAGE.EXTRACT.TRUNCATED },
  unsuitable_content: { isUsable: true, message: MESSAGE.EXTRACT.UNSUITABLE },
  under_limit: { isUsable: false, message: MESSAGE.EXTRACT.UNDER_LIMIT },
  fetch_failed: { isUsable: false, message: MESSAGE.EXTRACT.FAILED },
};

export const useExtractStatus = (status: ExtractStatus | null): ExtractStatusResult | null => {
  if (!status) return null;
  return STATUS_MAP[status];
};
