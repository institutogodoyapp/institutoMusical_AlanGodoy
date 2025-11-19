
import axios from 'axios';
import { authService } from '@/app/services/api/authSeervice';


export const httpClient = axios.create({
  baseURL: 'http://localhost:8080',
  //process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP,
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

// Interceptor de erros gerais (400, 404, 409, 500, etc.)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o outro interceptor tratou 401/403, não mexemos aqui
    if (!error.response) {
      return Promise.reject(new Error("Erro de conexão com o servidor"));
    }

    const status = error.response.status;
    const data = error.response.data;

    let message =
      data?.message ||
      data?.error ||
      "Erro inesperado na requisição";

    switch (status) {
      case 400:
        message = message || "Dados inválidos";
        break;

      case 401:
        // Este caso é tratado pelo refresh, aqui só fallback
        message = "Sessão expirada. Faça login novamente.";
        break;

      case 403:
        message = "Acesso negado";
        break;

      case 404:
        message = message || "Recurso não encontrado";
        break;

      case 409:
        message = message || "Conflito de dados";
        break;

      case 500:
        message = "Erro interno no servidor";
        break;
    }

    return Promise.reject(new Error(message));
  }
);
