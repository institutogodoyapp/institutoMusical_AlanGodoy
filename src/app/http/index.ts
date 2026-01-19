
import axios from 'axios';
import { authService } from '@/app/services/api/authSeervice';

const urlDev = 'http://localhost:8080'
export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INSTÂNCIA SEPARADA para refresh token (SEM interceptors)
export const refreshHttpClient = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token JWT no cabeçalho de todas as requisições
httpClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const { accessToken } = authService.getTokens();
      if (accessToken) {
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

    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes('/usuario/refresh');

    if ((status === 401 || status === 403)
      && !originalRequest._retry
      && !isRefreshRequest) {

      originalRequest._retry = true;

      const { refreshToken } = authService.getTokens();

      if (refreshToken) {
        try {

          const cleanRefreshToken = refreshToken.replace('Bearer ', '').trim();


          const response = await refreshHttpClient.post('/usuario/refresh', {}, {
            headers: { Authorization: `Bearer ${cleanRefreshToken}` }


          });


          authService.setTokens(response.data.accessToken, response.data.refreshToken);


          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;


          return httpClient(originalRequest);
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);

          authService.logout();
          window.location.href = '/instituto-musical/autenticacao/login';
          return Promise.reject(refreshError);
        }
      } else {

        authService.logout();
        window.location.href = '/instituto-musical/autenticacao/login';
        return Promise.reject(error);
      }
    }


    return Promise.reject(error);
  }
);
// Interceptor de erros gerais (400, 404, 409, 500, etc.)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {

    if (!error.response) {
      return Promise.reject({ message: "Erro de conexão com o servidor" });
    }

    const status = error.response.status;
    const data = error.response.data;

    // Se backend retorna string pura
    if (typeof data === "string") {
      return Promise.reject({ message: data });
    }

    let message = data?.message || data?.error || "Erro inesperado";

    switch (status) {
      case 400: message ||= "Dados inválidos"; break;
      case 401: message = "Sessão expirada. Faça login novamente."; break;
      case 403: message = "Acesso negado"; break;
      case 404: message ||= "Recurso não encontrado"; break;
      case 409: message ||= "Conflito de dados"; break;
      case 500: message = "Erro interno no servidor"; break;
    }

    return Promise.reject({ message });
  }
);
// Teste a nova instância de refresh


