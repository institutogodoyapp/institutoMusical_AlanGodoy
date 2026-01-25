import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/app/services/api/authSeervice';
import { httpClient, refreshClient } from '@/app/http';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica autenticação ao carregar
  useEffect(() => {
    setIsLoading(true)
    checkAuth();


  }, []);

  const checkAuth = useCallback(async () => {
    
    try {
      await refreshClient.post('usuario/refresh', {}, { withCredentials: true })
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    try {
      await authService.login({ email, senha });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login'
      };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();

    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };
};

export default useAuth