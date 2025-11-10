import Button from './Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog';
import { startKakaoLogin } from '@/services/api/auth.api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const handleKakaoLogin = () => {
    startKakaoLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>소셜 계정으로 간편하게 로그인하세요</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button
            onClick={handleKakaoLogin}
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#000000] rounded-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.607 4.617 4.074 6.051l-1.049 3.786c-.067.242.242.435.446.279l3.936-3.015c.862.122 1.753.187 2.657.187 5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
            </svg>
            카카오로 시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
