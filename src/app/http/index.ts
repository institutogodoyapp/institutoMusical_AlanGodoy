
import axios from 'axios';
import { authService } from '@/app/services/api/authSeervice';


export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('BaseURL configurada novo:', process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP);
// Adiciona o token JWT no cabeçalho de todas as requisições
httpClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const { accessToken } = authService.getTokens();
      if (accessToken) {
        // Adiciona "Bearer " antes do token
        config.headers['Authorization'] = `${accessToken.trim()}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar token expirado
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Verifica se é erro 401 (não autorizado) e se já não tentou refresh
    if ((error.response?.status === 401 && !originalRequest._retry) || (error.response?.status === 403 && !originalRequest._retry) ) {
      originalRequest._retry = true;
      
      const { refreshToken } = authService.getTokens();
  
      if (refreshToken) {
        try {
          // Remove "Bearer " se existir
          const cleanRefreshToken = refreshToken.replace('Bearer ', '').trim();
          
          // Faz requisição para refresh token
          const response = await httpClient.post('/usuario/refresh', {}, {
            headers: { 
              'Authorization': `Bearer ${cleanRefreshToken}`
            }
          });

          // Atualiza tokens
          authService.setTokens(response.data.accessToken, response.data.refreshToken);
          
          // Atualiza header da requisição original
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          // Repete a requisição original
          return httpClient(originalRequest);
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          // Refresh token também expirou - faz logout
          authService.logout();
          window.location.href = '/instituto-musical/autenticacao/login'; // Redireciona para login
          return Promise.reject(refreshError);
        }
      } else {
        // Não há refresh token - faz logout
        authService.logout();
        window.location.href = '/instituto-musical/autenticacao/login';
        return Promise.reject(error);
      }
    }
    
    // Para outros erros, simplesmente rejeita
    return Promise.reject(error);
  }
);