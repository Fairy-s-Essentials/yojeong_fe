import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, LogOut, MessageSquare, UserCircle } from 'lucide-react';
import logo from '@/assets/logo/yojeng.webp';
import { useAuth } from '@/hooks/auth/useAuth';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  LoginButton,
  ProfileIcon,
  TextArea,
} from '@/components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './Dropdown';

const Header = ({ isMainPage = false }: { isMainPage?: boolean }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading, openLoginModal, openLogoutAlert } = useAuth();

  const [isVocModalOpen, setIsVocModalOpen] = useState(false);
  const [vocContent, setVocContent] = useState('');

  const handleProfileClick = () => {
    if (isLoggedIn) {
      openLogoutAlert();
    } else {
      openLoginModal();
    }
  };

  const handleLogoButton = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleVocClick = () => {
    setIsVocModalOpen(true);
  };

  const handleVocSubmit = () => {
    // TODO: API 연동
    setVocContent('');
    setIsVocModalOpen(false);
  };

  return (
    <header className="bg-white border-b border-app-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {isMainPage ? (
          <>
            {/* 로고 */}
            <button
              onClick={handleLogoButton}
              className="flex items-center gap-1 text-app-gray-800 hover:text-app-blue transition-colors cursor-pointer"
            >
              <img src={logo} alt="요약의 정석" className="w-10 h-10" />
              요약의 정석
            </button>
            {/* 로그인/프로필 */}
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-app-gray-200 animate-pulse" />
            ) : isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-app-gray-50 rounded-full transition-colors">
                      <ProfileIcon user={user} onClick={handleProfileClick} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleMypageClick}>
                      <UserCircle className="w-4 h-4 mr-2" />
                      마이페이지
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleVocClick}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      문의·불편 접수
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openLogoutAlert()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* VOC 모달 */}
                <Dialog open={isVocModalOpen} onOpenChange={setIsVocModalOpen}>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>문의·불편 접수</DialogTitle>
                      <DialogDescription>불편사항이나 개선 아이디어를 자유롭게 남겨주세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <TextArea
                        placeholder="내용을 입력해주세요..."
                        value={vocContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVocContent(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsVocModalOpen(false);
                          setVocContent('');
                        }}
                      >
                        취소
                      </Button>
                      <Button onClick={handleVocSubmit} disabled={!vocContent.trim()}>
                        제출
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <LoginButton />
            )}
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
