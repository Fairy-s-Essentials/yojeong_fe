import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { showToast } from '@/utils/toast';

export const useAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');

    if (success === 'true') {
      navigate('/');
    } else if (success === 'false') {
      const error = params.get('error');

      // 탈퇴 후 24시간 동안 재가입 제한
      if (error === 'rejoin_restricted') {
        showToast('LOGIN_RESTRICTED');
      } else {
        showToast('LOGIN_ERROR');
      }

      navigate('/');
    }
  }, [navigate]);
};
