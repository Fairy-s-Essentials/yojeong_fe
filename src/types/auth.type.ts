import type { ApiResponse } from './api.type';

export interface User {
  id: number;
  kakao_id: number;
  nickname: string;
  email: string;
  profile_image?: string;
}

export interface AuthResponse extends ApiResponse<User> {}
