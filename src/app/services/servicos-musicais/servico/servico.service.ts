import { httpClient } from '@/app/http/';
import { Servico, ServicoForm } from '@/app/models/Servicos-musicais/servico';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/servicos-musicais/servico';

export const useServicoService = () => {

    // =========================================================================
    // OPERAÇÕES DE CRIAÇÃO E ATUALIZAÇÃO DE SERVIÇOS
    // =========================================================================

    const salvarServico = async (servico: ServicoForm): Promise<ServicoForm> => {
        const response: AxiosResponse<Servico> =
            await httpClient.post(`${resourceURL}`, servico);
        return response.data;
    };

    const atualizarServico = async (servicoId: number, updates: Record<string, any>): Promise<ServicoForm> => {
        const response: AxiosResponse<Servico> =
            await httpClient.patch(`${resourceURL}/${servicoId}`, updates);
        return response.data;
    };

    const deleteById = async (servicoId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${servicoId}`);
    };

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE SERVIÇOS
    // =========================================================================

    const getServicos = async (): Promise<Servico[]> => {
        const response: AxiosResponse<Servico[]> =
            await httpClient.get(`${resourceURL}`);
        return response.data;
    };

    const getServicoById = async (servicoId: number): Promise<Servico> => {
        const response: AxiosResponse<Servico> =
            await httpClient.get(`${resourceURL}/${servicoId}`);
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        salvarServico,
        atualizarServico,
        deleteById,
        getServicos,
        getServicoById
    };
};
