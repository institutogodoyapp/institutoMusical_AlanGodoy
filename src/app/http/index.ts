
import axios from 'axios';
import { authService } from '@/app/services/api/authSeervice';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  console.log('🚀 Request URL:', config.url);
  console.log('🚀 Cookies enviados?', document.cookie.length); // DEBUG
  return config;
});

refreshClient.interceptors.request.use((config) => {
  console.log('🔄 REFRESH Request - withCredentials:', config.withCredentials);
  return config;
});

// Flag global para evitar múltiplos refreshes
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Interceptor request
// Request interceptor CORRIGIDO
httpClient.interceptors.request.use(

  (config) => config,

  
  (error) => Promise.reject(error)
);

console.log(httpClient.interceptors.request)

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 🔑 PROTEÇÕES
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }



    if ((status === 401 || status === 403) && !originalRequest._retry) {
  

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => httpClient(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshClient.post('/usuario/refresh', {});
        isRefreshing = false;
        processQueue(null);
        return httpClient(originalRequest);
      } catch (refreshError: any) {

        console.log(refreshError.message)
        isRefreshing = false;
        processQueue(refreshError, null);
      //  authService.logout();
      //  window.location.href = '/instituto-musical/autenticacao/login';
        //return Promise.reject(refreshError);
      }
    }

    // Outros erros
    if (!error.response) return Promise.reject({ message: "Erro de conexão" });
    let message = error.response.data?.message || "Erro inesperado";
    switch (status) {
      case 400: message ||= "Dados inválidos"; break;
   //   case 403: message = "Acesso negado"; break;
      case 404: message ||= "Recurso não encontrado"; break;
      case 409: message ||= "Conflito de dados"; break;
      case 500: message = "Erro no servidor"; break;
    }
    return Promise.reject({ message });
  }
);
