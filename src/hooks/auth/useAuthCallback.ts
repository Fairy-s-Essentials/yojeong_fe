import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');

    if (success === 'true') {
      navigate('/');
    } else if (success === 'false') {
      // 로그인 실패
      const error = params.get('error');
      alert(`로그인 실패: ${error || '알 수 없는 오류'}`);
      navigate('/');
    }
  }, [navigate]);
};