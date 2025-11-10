import Button from './Button';
import { useAuth } from '@/hooks/auth/useAuth';

const LoginButton = () => {
  const { openLoginModal } = useAuth();

  return (
    <Button onClick={openLoginModal} variant="default" size="default" className="cursor-pointer">
      로그인
    </Button>
  );
};

export default LoginButton;
