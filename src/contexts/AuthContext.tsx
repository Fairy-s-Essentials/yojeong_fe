/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { checkAuth } from '@/services/api/auth.api';
import type { User } from '@/types/auth.type';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const value: AuthContextValue = {
    user,
    isLoading,
    isLoggedIn: !!user,
    refetch: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
