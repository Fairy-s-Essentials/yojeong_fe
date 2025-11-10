import { useNavigate } from 'react-router';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { AuthProfileButton, LoginButton } from '@/components';
import { useAuth } from '@/hooks/auth/useAuth';

const Header = ({ isMainPage = false }: { isMainPage?: boolean }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleLogoButton = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <header className="bg-white border-b border-app-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {isMainPage ? (
          <>
            {/* 로고 */}
            <button
              onClick={handleLogoButton}
              className="flex items-center gap-2 text-app-gray-800 hover:text-app-blue transition-colors cursor-pointer"
            >
              <BookOpen className="w-6 h-6 text-app-blue" />
              요약의 정석
            </button>
            {/* 로그인/프로필 */}
            {isLoggedIn ? <AuthProfileButton /> : <LoginButton />}
          </>
        ) : (
          <>
            {/* 뒤로 가기 */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-app-gray-500 hover:text-app-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">돌아가기</span>
            </button>
            {/* 로고 */}
            <button
              onClick={handleLogoButton}
              className="flex items-center gap-2 text-app-gray-800 hover:text-app-blue transition-colors cursor-pointer"
            >
              요약의 정석
            </button>
            {/* 오른쪽 공간 유지를 위한 빈 div */}
            <div className="w-20"></div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
