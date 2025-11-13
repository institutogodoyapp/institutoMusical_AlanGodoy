import { httpClient } from '@/app/http/'
import { Cliente } from '@/app/models/Servicos-musicais/cliente'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/admin/servicos-musicais/clientes'

export const useClienteService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE CLIENTES
    // =========================================================================

    const salvarCliente = async (cliente: Cliente): Promise<Cliente> => {
        try {
            const response: AxiosResponse<Cliente> = await httpClient.post(resourceURL, cliente)
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

    const deletar = async (clienteId: number): Promise<void> => {
           
            try {
                await httpClient.delete(`${resourceURL}/${clienteId}`)
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

    const atualizarCliente = async (clienteId: number, updates: Record<string, any>): Promise<Cliente> => {
        try {
            const response: AxiosResponse<Cliente> = await httpClient.patch(`${resourceURL}/${clienteId}/parcial`, updates)
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

    const getClient = async (): Promise<Cliente[]> => {
        try {
            const response: AxiosResponse<Cliente[]> = await httpClient.get(resourceURL)
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

    const getClientById = async (clienteId: number): Promise<Cliente> => {
        try {
            const response: AxiosResponse<Cliente> = await httpClient.get(`${resourceURL}/${clienteId}/cliente`)
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
        salvarCliente,
        atualizarCliente,
        deletar,
        getClient,
        getClientById
    }
}