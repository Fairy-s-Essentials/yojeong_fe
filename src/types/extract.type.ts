import type { ApiResponse } from './api.type';

export interface ExtractRequest {
  url: string;
}

export type ExtractStatus = 'success' | 'truncated' | 'under_limit' | 'unsuitable_content' | 'fetch_failed';

export interface ExtractResult {
  status: ExtractStatus;
  content: string | null;
}

export type ExtractResponse = ApiResponse<ExtractResult>;
