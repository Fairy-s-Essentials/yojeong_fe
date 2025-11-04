export interface User {
  id: number;
  kakao_id: number;
  nickname: string;
  email: string;
  profile_image?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
}

