import { httpClient } from '@/app/http/';
import {
    Usuario,
    UsuarioLogin,
    LoginResponse,
    MudancaSenhaRequest
} from '@/app/models/usuario';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/usuario';

export const useUsuarioService = () => {

    // =========================================================================
    // OPERAÇÕES DE AUTENTICAÇÃO
    // =========================================================================

    const cadastrarUsuario = async (user: Usuario): Promise<Usuario> => {
        const response: AxiosResponse<Usuario> =
            await httpClient.post<Usuario>(resourceURL, user);
        return response.data;
    };

    const atualizarUsuario = async (user: Usuario): Promise<Usuario> => {
        const response: AxiosResponse<Usuario> =
            await httpClient.put<Usuario>(resourceURL, user);
        return response.data;
    };

    const login = async (user: UsuarioLogin): Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> =
            await httpClient.post<LoginResponse>(`${resourceURL}/login`, user);
        return response.data;
    };

    const logout = async (token: string): Promise<void> => {
        const response: AxiosResponse<void> =
            await httpClient.post<void>(`${resourceURL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    };

    const atualizarSenha = async (dados: MudancaSenhaRequest): Promise<void> => {
        const response = await httpClient.put(`${resourceURL}/mudar-senha`, dados);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE USUÁRIO
    // =========================================================================

    const getUser = async (): Promise<Usuario> => {
        const response: AxiosResponse<Usuario> =
            await httpClient.get<Usuario>(resourceURL);
        return response.data;
    };

    const getUserByEmail = async (userEmail: string): Promise<Usuario> => {
        const response: AxiosResponse<Usuario> =
            await httpClient.get<Usuario>(`${resourceURL}/buscar-por-email`, {
                params: { email: userEmail }
            });
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        cadastrarUsuario,
        atualizarUsuario,
        login,
        logout,
        getUser,
        getUserByEmail,
        atualizarSenha
    };
};
