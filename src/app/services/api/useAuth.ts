import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/app/services/api/authSeervice';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica autenticação ao carregar
  useEffect(() => {
    setIsLoading(true)
    checkAuth();
    
      
  }, []);

  const checkAuth = useCallback(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated)
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    try {
      const response = await authService.login({ email, senha });
      authService.setTokens(response.accessToken, response.refreshToken);
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