import type { ApiResponse } from './api.type';

export interface VocRequest {
  message: string;
}

export interface VocResponse extends ApiResponse<undefined> {
  message: string;
}
