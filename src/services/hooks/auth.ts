import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { userWithdrawal } from '../api/auth.api';

/**
 * 회원탈퇴 Mutation Hook
 * - 탈퇴 후 인증 상태 초기화 및 메인 페이지로 이동
 */
export const useWithdraw = () => {
  const navigate = useNavigate();
  const { refetch } = useAuth();

  return useMutation({
    mutationFn: userWithdrawal,
    onSuccess: async () => {
      // 인증 상태 초기화 (서버 세션 확인)
      await refetch();

      // 메인 페이지로 이동
      navigate('/', { replace: true });

      // 완료 알림
      alert('회원탈퇴가 완료되었습니다.');
    },
    onError: () => {
      alert('회원탈퇴에 실패했습니다.');
    },
  });
};
