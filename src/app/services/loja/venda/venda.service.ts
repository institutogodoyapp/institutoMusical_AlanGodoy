import { httpClient } from '@/app/http/';
import { Fornecedor, FornecedorForm, MetricasVendas, Venda } from '@/app/models/loja/venda';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/loja/vendas';

export const useVendaService = () => {

    // =========================================================================
    // OPERAÇÕES DE VENDAS
    // =========================================================================

    const getVendas = async (): Promise<Venda[]> => {
        const response: AxiosResponse<Venda[]> = await httpClient.get(resourceURL);
        return response.data;
    };

    const realizarVenda = async (venda: Venda): Promise<Venda> => {
        const response: AxiosResponse<Venda> = await httpClient.post(`${resourceURL}`, venda);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE MÉTRICAS
    // =========================================================================

    const getMetricsVendas = async (): Promise<MetricasVendas> => {
        const response: AxiosResponse<MetricasVendas> =
            await httpClient.get(`${resourceURL}/metricasVenda`);
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getVendas,
        realizarVenda,
        getMetricsVendas
    };
};
