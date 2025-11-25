/**
 * API 응답 타입
 * @template T 응답 데이터 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
