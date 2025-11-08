import { useAuthCallback } from '@/hooks/auth/useAuthCallback';

export const AuthCallbackPage = () => {
  useAuthCallback();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-blue mx-auto mb-4"></div>
        <p className="text-app-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};