import { httpClient } from '@/app/http/'
import { Fornecedor, FornecedorForm, MetricasVendas, Venda } from '@/app/models/loja/venda'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/admin/loja/vendas'

export const useVendaService = () => {

    // =========================================================================
    // OPERAÇÕES DE VENDAS
    // =========================================================================

    const getVendas = async (): Promise<Venda[]> => {
        try {
            const response: AxiosResponse<Venda[]> = await httpClient.get(resourceURL)
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

    const realizarVenda = async (venda: Venda): Promise<Venda> => {
        try {
            const response: AxiosResponse<Venda> = await httpClient.post(`${resourceURL}`, venda)
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
    // OPERAÇÕES DE MÉTRICAS
    // =========================================================================

    const getMetricsVendas = async (): Promise<MetricasVendas> => {
        try {
            const response: AxiosResponse<MetricasVendas> = await httpClient.get(`${resourceURL}/metricasVenda`)
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

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getVendas,
        realizarVenda,
        getMetricsVendas
    }
}