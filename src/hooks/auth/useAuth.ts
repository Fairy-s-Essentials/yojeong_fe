import { useState, useEffect } from 'react';
import { checkAuth } from '@/services/api/auth.api';
import type { User } from '@/types/auth';

export const useAuth = () => {
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
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    refetch: loadUser,
  };
};

