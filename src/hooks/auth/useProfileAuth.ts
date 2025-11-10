import { useState } from 'react';
import { useAuth } from './useAuth';
import { startKakaoLogin, logout } from '@/services/api/auth.api';

export const useProfileAuth = () => {
  const { user, isLoggedIn, refetch } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setIsLogoutAlertOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleKakaoLogin = () => {
    startKakaoLogin();
  };

  const handleLogout = async () => {
    try {
      await logout();
      await refetch();
      setIsLogoutAlertOpen(false);
      alert('로그아웃되었습니다.');
    } catch {
      alert('로그아웃에 실패했습니다.');
    }
  };

  return {
    user,
    isLoggedIn,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isLogoutAlertOpen,
    setIsLogoutAlertOpen,
    handleProfileClick,
    handleKakaoLogin,
    handleLogout,
  };
};
