import { useNavigate } from 'react-router';
import { BookOpen } from 'lucide-react';
import { ProfileIcon } from '@/components';

// TODO: 메인 페이지가 아닐 때 헤더 ui 추가 구현
const Header = () => {
  const navigate = useNavigate();

  const handleLogoButton = () => {
    navigate('/');
  };

  return (
    // 메인 페이지 헤더
    <header className="bg-white border-b border-app-gray-200 sticky top-0 z-0 ">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <button
          onClick={handleLogoButton}
          className="flex items-center gap-2 text-app-gray-800 hover:text-app-blue transition-colors cursor-pointer"
        >
          <BookOpen className="w-6 h-6 text-app-blue" />
          요약의 정석
        </button>

        {/* 프로필 */}
        <ProfileIcon />
      </div>
    </header>
  );
};

export default Header;
