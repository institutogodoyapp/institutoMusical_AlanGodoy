import { httpClient } from '@/app/http/'
import { Usuario, UsuarioLogin, LoginResponse, MudancaSenhaRequest } from '@/app/models/usuario'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/usuario'

export const useUsuarioService = () => {

    // =========================================================================
    // OPERAÇÕES DE AUTENTICAÇÃO
    // =========================================================================

    const cadastrarUsuario = async (user: Usuario): Promise<Usuario> => {
        try {
            const response: AxiosResponse<Usuario> = await httpClient.post<Usuario>(resourceURL, user)
            return response.data
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    }

        const atualizarUsuario = async (user: Usuario): Promise<Usuario> => {
        try {
            const response: AxiosResponse<Usuario> = await httpClient.put<Usuario>(resourceURL, user)
            return response.data
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    }

    const login = async (user: UsuarioLogin): Promise<LoginResponse> => {
        try {
            console.log("fui")

            const response: AxiosResponse<LoginResponse> = await httpClient.post<LoginResponse>(resourceURL + '/login', user)
            return response.data
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    }

    const logout = async (token: string): Promise<void> => {
        try {
            const response: AxiosResponse<void> = await httpClient.post<void>(resourceURL + '/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    }

    const atualizarSenha = async (dados: MudancaSenhaRequest): Promise<void> => {
        try {
            console.log('chamei')
            const response = await httpClient.put(resourceURL +'/mudar-senha', dados);
            console.log(response.data, dados)
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao atualizar senha');
        }
    };

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE USUÁRIO
    // =========================================================================

    const getUser = async (): Promise<Usuario> => {
        try {
            const response: AxiosResponse<Usuario> = await httpClient.get<Usuario>(resourceURL)
            console.log(response.data)
            return response.data
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    }


    const getUserByEmail = async (userEmail: string): Promise<Usuario> => {
        console.log(userEmail)
        try {
            const response: AxiosResponse<Usuario> = await httpClient.get<Usuario>(`${resourceURL}/buscar-por-email`, {
                params: {
                    email: userEmail
                }
            })
            return response.data
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    }

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
    }
}