import api from './index';
import type { AuthResponse } from '@/types/auth.type';

// 현재 로그인 사용자 정보 조회
export const checkAuth = async (): Promise<AuthResponse> => {
  const { data } = await api.get<AuthResponse>('/auth/me');
  return data;
};

// 로그아웃
export const logout = async (): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/logout');
  return data;
};

// 카카오 로그인 시작 (window.location 사용)
export const startKakaoLogin = (): void => {
  window.location.href = `${api.defaults.baseURL}/auth/kakao`;
};

// 회원 탈퇴
export const userWithdrawal = async () => {
  const { data } = await api.patch('/auth/withdraw');
  return data;
};
