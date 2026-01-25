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
  login: async (loginData: LoginData): Promise<void> => {

    await httpClient.post(
      '/usuario/login',
      loginData,
      { withCredentials: true });


  },

  logout: async (): Promise<void> => {

    try {

      await service.logout();
    } catch { }

    window.location.href = '/instituto-musical/autenticacao/login'

  },

  
  // isAuthenticated: (): boolean => {
  //   return 
  // }

}