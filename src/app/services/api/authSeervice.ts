import { httpClient } from '@/app/http';
import { useUsuarioService } from '@/app/services/usuario'

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
const service = useUsuarioService()
   
export const authService = {

  

  // Login
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    console.log(loginData)
    const response = await httpClient.post('/usuario/login', loginData);
    return response.data;
  },

  logout: async (): Promise<void> => {
   

    console.log("fui")
    try {
      const pubi = localStorage.getItem('refreshToken')
      if(!pubi) return


    await service.logout(pubi);
 console.log("fui sucesso")
    } catch (error) {
      // Não importa se falhar, faz logout local de qualquer forma
      console.log('Logout remoto opcional', error);
    }

    // Limpeza local (ESSENCIAL)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('jwt');
    localStorage.removeItem('_usuario_logado');

    // Redireciona para login
    window.location.href = '/instituto-musical/autenticacao/login';
  },


  // Verifica se usuário está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
 const refreshToken = localStorage.getItem('refreshToken');
 const accessToken = localStorage.getItem('accessToken');
   

    return !!(accessToken && refreshToken);
  },

  // Obtém tokens
  getTokens: (): { accessToken: string | null; refreshToken: string | null } => {
    if (typeof window === 'undefined') {
      return { accessToken: null, refreshToken: null };
    }

    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  },

  // Salva tokens
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};