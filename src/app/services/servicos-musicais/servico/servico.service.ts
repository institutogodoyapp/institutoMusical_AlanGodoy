import { httpClient } from '@/app/http/'
import { CategoriaServico, CategoriaServicoForm } from '@/app/models/Servicos-musicais/categoria-servico'
import { Cliente } from '@/app/models/Servicos-musicais/cliente'
import { Pedido } from '@/app/models/Servicos-musicais/pedido'
import { MetricasServico, Servico, ServicoForm } from '@/app/models/Servicos-musicais/servico'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/admin/servicos-musicais/servico'

export const useServicoService = () => {

    // =========================================================================
    // OPERAÇÕES DE CRIAÇÃO E ATUALIZAÇÃO DE SERVIÇOS
    // =========================================================================

    const salvarServico = async (servico: ServicoForm): Promise<ServicoForm> => {
        try {
            const response: AxiosResponse<Servico> = await httpClient.post(`${resourceURL}`, servico)
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

    const atualizarServico = async (servicoId: number, updates: Record<string, any>): Promise<ServicoForm> => {
        try {
            const response: AxiosResponse<Servico> = await httpClient.patch(`${resourceURL}/${servicoId}`, updates)
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
    // OPERAÇÕES DE CONSULTA DE SERVIÇOS
    // =========================================================================

    const getServicos = async (): Promise<Servico[]> => {
        try {
            const response: AxiosResponse<Servico[]> = await httpClient.get(`${resourceURL}`)
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

    const getServicoById = async (servicoId: number): Promise<Servico> => {
        try {
            const response: AxiosResponse<Servico> = await httpClient.get(`${resourceURL}/${servicoId}`)
            console.log(response)
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
        salvarServico,
        atualizarServico,
        getServicos,
        getServicoById
    }
}