import { createContext } from 'react';
import type { User } from '@/types/auth.type';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refetch: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLogoutAlertOpen: boolean;
  openLogoutAlert: () => void;
  closeLogoutAlert: () => void;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
