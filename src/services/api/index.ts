import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const AUTH_TOKEN_KEY = "yojeong_auth_token";

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 토큰 제거 (인증 실패)
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      // 필요시 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// 토큰 관리 유틸 함수들
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export default api;
