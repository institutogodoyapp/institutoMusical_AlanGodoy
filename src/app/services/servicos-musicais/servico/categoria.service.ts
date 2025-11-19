import { httpClient } from '@/app/http/';
import { CategoriaServico, CategoriaServicoForm } from '@/app/models/Servicos-musicais/categoria-servico';
import { DadosModal } from '@/components/common/modal/modal-generico';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/servicos-musicais/servico';

export const useCategoriaService = () => {

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE CATEGORIAS
    // =========================================================================

    const getCategorias = async (): Promise<CategoriaServico[]> => {
        const response: AxiosResponse<CategoriaServico[]> =
            await httpClient.get(`${resourceURL}/categoria/listarAtivos`);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE CRIAÇÃO E ATUALIZAÇÃO DE CATEGORIAS
    // =========================================================================

    const salvarCategoria = async (categoria: DadosModal): Promise<CategoriaServico> => {
        const response: AxiosResponse<CategoriaServico> =
            await httpClient.post(`${resourceURL}/categoria/criar`, categoria);
        return response.data;
    };

    const atualizarCategoria = async (categoriaId: number, update: Record<string, any>): Promise<CategoriaServicoForm> => {
        const response: AxiosResponse<CategoriaServico> =
            await httpClient.patch(`${resourceURL}/categoria/${categoriaId}/parcial`, update);
        return response.data;
    };

    const deletarCategoria = async (categoriaId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/categoria/${categoriaId}/deletar`);
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getCategorias,
        salvarCategoria,
        atualizarCategoria,
        deletarCategoria
    };
};
