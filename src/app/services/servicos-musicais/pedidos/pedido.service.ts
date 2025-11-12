import { httpClient } from '@/app/http/'
import { Cliente } from '@/app/models/Servicos-musicais/cliente'
import { Pedido, PedidoForm, StatusPedido } from '@/app/models/Servicos-musicais/pedido'
import { MetricasServico } from '@/app/models/Servicos-musicais/servico'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/admin/servicos-musicais/pedido'

export const usePedidoService = () => {

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE PEDIDOS
    // =========================================================================

    const getPedidoByClienteId = async (clienteId: number): Promise<Pedido[]> => {
        try {
            const response: AxiosResponse<Pedido[]> = await httpClient.get(`${resourceURL}/cliente/${clienteId}/status`)
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

    const getPedidoById = async (pedidoId: number): Promise<Pedido> => {
        try {
            const response: AxiosResponse<Pedido> = await httpClient.get(`${resourceURL}/${pedidoId}`)
            console.log("pelo id", response)
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

    const getPedidos = async (): Promise<Pedido[]> => {
        try {
            const response: AxiosResponse<Pedido[]> = await httpClient.get(`${resourceURL}`)
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
    // OPERAÇÕES DE CRIAÇÃO E ATUALIZAÇÃO DE PEDIDOS
    // =========================================================================

    const realizarPedido = async (pedido: Pedido): Promise<Pedido> => {
        try {
            console.log("cheguei na funcao", pedido)

            const response: AxiosResponse<Pedido> = await httpClient.post(`${resourceURL}`, pedido)
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

    const atualizarPedido = async (pedidoId: number, updates: Record<string, any>): Promise<Pedido> => {
        try {
            console.log("cheguei na funcao", updates)

            const response: AxiosResponse<Pedido> = await httpClient.patch(`${resourceURL}/${pedidoId}/parcial`, updates)
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

    const mudarStatus = async (pedidoId: number, status: StatusPedido): Promise<Pedido> => {
        try {
            const response: AxiosResponse<Pedido> = await httpClient.patch(`${resourceURL}/${pedidoId}/status?status=${status}`)
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
    // OPERAÇÕES DE EXCLUSÃO E MÉTRICAS
    // =========================================================================

    const deletarPedidos = async (pedidoId: number): Promise<void> => {
        try {
            const response: AxiosResponse<void> = await httpClient.delete(`${resourceURL}/${pedidoId}`)
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

    const getMetricas = async (): Promise<MetricasServico> => {
        try {
            const response: AxiosResponse<MetricasServico> = await httpClient.get(`${resourceURL}/metricasServico`)
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
        // Operações de Consulta
        getPedidoByClienteId,
        getPedidoById,
        getPedidos,
        
        // Operações de Criação e Atualização
        realizarPedido,
        atualizarPedido,
        mudarStatus,
        
        // Operações de Exclusão e Métricas
        deletarPedidos,
        getMetricas
    }
}