import { httpClient } from '@/app/http/';
import { Pedido, PedidoForm, StatusPedido } from '@/app/models/Servicos-musicais/pedido';
import { MetricasServico } from '@/app/models/Servicos-musicais/servico';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/servicos-musicais/pedido';

export const usePedidoService = () => {

    // =========================================================================
    // OPERAÇÕES DE CONSULTA DE PEDIDOS
    // =========================================================================

    const getPedidoByClienteId = async (clienteId: number): Promise<Pedido[]> => {
        const response: AxiosResponse<Pedido[]> =
            await httpClient.get(`${resourceURL}/cliente/${clienteId}/status`);
        return response.data;
    };

    const getPedidoById = async (pedidoId: number): Promise<Pedido> => {
        const response: AxiosResponse<Pedido> =
            await httpClient.get(`${resourceURL}/${pedidoId}`);
        return response.data;
    };

    const getPedidos = async (): Promise<Pedido[]> => {
        const response: AxiosResponse<Pedido[]> =
            await httpClient.get(`${resourceURL}`);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE CRIAÇÃO E ATUALIZAÇÃO DE PEDIDOS
    // =========================================================================

    const realizarPedido = async (pedido: Pedido): Promise<Pedido> => {
        const response: AxiosResponse<Pedido> =
            await httpClient.post(`${resourceURL}`, pedido);
        return response.data;
    };

    const atualizarPedido = async (pedidoId: number, updates: Record<string, any>): Promise<Pedido> => {
        const response: AxiosResponse<Pedido> =
            await httpClient.patch(`${resourceURL}/${pedidoId}/parcial`, updates);
        return response.data;
    };

    const mudarStatus = async (pedidoId: number, status: StatusPedido): Promise<Pedido> => {
        const response: AxiosResponse<Pedido> =
            await httpClient.patch(`${resourceURL}/${pedidoId}/status?status=${status}`);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE EXCLUSÃO E MÉTRICAS
    // =========================================================================

    const deletarPedidos = async (pedidoId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${pedidoId}`);
    };

    const getMetricas = async (): Promise<MetricasServico> => {
        const response: AxiosResponse<MetricasServico> =
            await httpClient.get(`${resourceURL}/metricasServico`);
        return response.data;
    };

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
    };
};
