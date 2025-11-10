import { useState, useEffect, type ReactNode } from 'react';
import { checkAuth, logout } from '@/services/api/auth.api';
import type { User } from '@/types/auth';
import { LoginModal, LogoutModal } from '@/components';
import { AuthContext, type AuthContextValue } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const loadUser = async () => {
    try {
      const response = await checkAuth();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openLogoutAlert = () => {
    setIsLogoutAlertOpen(true);
  };

  const closeLogoutAlert = () => {
    setIsLogoutAlertOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await loadUser();
      setIsLogoutAlertOpen(false);
      alert('로그아웃되었습니다.');
    } catch {
      alert('로그아웃에 실패했습니다.');
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isLoggedIn: !!user,
    refetch: loadUser,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isLogoutAlertOpen,
    openLogoutAlert,
    closeLogoutAlert,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <LogoutModal isOpen={isLogoutAlertOpen} onClose={closeLogoutAlert} onLogout={handleLogout} />
    </AuthContext.Provider>
  );
};
