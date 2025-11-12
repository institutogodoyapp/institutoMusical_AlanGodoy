import { httpClient } from '@/app/http/'
import { CategoriaServico, CategoriaServicoForm } from '@/app/models/Servicos-musicais/categoria-servico'
import { Cliente } from '@/app/models/Servicos-musicais/cliente'
import { Pedido } from '@/app/models/Servicos-musicais/pedido'
import { DadosModal } from '@/components/common/modal/modal-generico'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/admin/servicos-musicais/servico'

export const useCategoriaService = () => {

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE CATEGORIAS
    // =========================================================================

    const getCategorias = async (): Promise<CategoriaServico[]> => {
        try {
            const response: AxiosResponse<CategoriaServico[]> = await httpClient.get(`${resourceURL}/categoria/listarAtivos`)
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
    // OPERAÇÕES DE CRIAÇÃO E ATUALIZAÇÃO DE CATEGORIAS
    // =========================================================================

    const salvarCategoria = async (categoria: DadosModal): Promise<CategoriaServico> => {
        try {
            const response: AxiosResponse<CategoriaServico> = await httpClient.post(`${resourceURL}/categoria/criar`, categoria)
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

    const atualizarCategoria = async (categoriaId: number, update: Record<string, any>): Promise<CategoriaServicoForm> => {
        try {
            const response: AxiosResponse<CategoriaServico> = await httpClient.patch(`${resourceURL}/categoria/${categoriaId}/parcial`, update)
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

    const deletarCategoria = async (categoriaId: number): Promise<void> => {
        console.log("id",categoriaId)
        try {
            await httpClient.delete(`${resourceURL}/categoria/${categoriaId}/deletar`)
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
        getCategorias,
        salvarCategoria,
        atualizarCategoria,
        deletarCategoria
    }
}