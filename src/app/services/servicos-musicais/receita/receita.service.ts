import { httpClient } from '@/app/http/';
import { Receita } from "@/app/models/Servicos-musicais/receita";
import {
    CategoriaDespesaServico,
    CategoriaDespesaServicoCadastro,
    DespesasServico,
    DespesasServicoCadastro
} from "@/app/models/Servicos-musicais/receita/despesa";
import { AxiosResponse } from "axios";

const resourceURL: string = '/admin/servicos-musicais/';

export const useReceitaServicoService = () => {

    // =========================================================================
    // OPERAÇÕES DE DESPESAS
    // =========================================================================

    const listarDespesas = async (): Promise<DespesasServico[]> => {
        const response: AxiosResponse<DespesasServico[]> =
            await httpClient.get(resourceURL + 'despesasServico');
        return response.data;
    };

    const buscarDespesaPorId = async (despesaId: number): Promise<DespesasServico> => {
        const response: AxiosResponse<DespesasServico> =
            await httpClient.get(resourceURL + `despesasServico/${despesaId}`);
        return response.data;
    };

    const adicionarDespesas = async (despesas: DespesasServico): Promise<DespesasServico> => {
        const response: AxiosResponse<DespesasServico> =
            await httpClient.post(resourceURL + 'despesasServico', despesas);
        return response.data;
    };

    const atualizarDespesa = async (despesaId: number, updates: Record<string, any>): Promise<DespesasServico> => {
        const response: AxiosResponse<DespesasServico> =
            await httpClient.patch(`${resourceURL}despesasServico/${despesaId}/parcial`, updates);
        return response.data;
    };

    const deletarDespesa = async (despesaId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}despesasServico/${despesaId}/deletar`);
    };

    const ValorTotalDespesa = async (): Promise<number> => {
        const response: AxiosResponse<number> =
            await httpClient.get(resourceURL + 'despesasServico/total');
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE CATEGORIAS
    // =========================================================================

    const listarCategoriaDespesas = async (): Promise<CategoriaDespesaServico[]> => {
        const response: AxiosResponse<CategoriaDespesaServico[]> =
            await httpClient.get(resourceURL + 'categoriaServico');
        return response.data;
    };

    const adicionarCategoria = async (categoria: CategoriaDespesaServicoCadastro): Promise<CategoriaDespesaServicoCadastro> => {
        const response: AxiosResponse<CategoriaDespesaServicoCadastro> =
            await httpClient.post(resourceURL + 'categoriaServico', categoria);
        return response.data;
    };

    const atualizarCategoria = async (categoriaId: number, updates: Record<string, any>): Promise<CategoriaDespesaServico> => {
        const response: AxiosResponse<CategoriaDespesaServico> =
            await httpClient.patch(`${resourceURL}categoriaServico/${categoriaId}/parcial`, updates);
        return response.data;
    };

    const DeletarCategoria = async (categoriaId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}categoriaServico/${categoriaId}`);
    };

    // =========================================================================
    // OPERAÇÕES DE RECEITA
    // =========================================================================

    const receita = async (): Promise<Receita> => {
        const response: AxiosResponse<Receita> =
            await httpClient.get(resourceURL + 'receitaServico/receita-do-mes');
        return response.data;
    };

    const receitaPorPeriodo = async (dataInicio: string, dataFim: string): Promise<Receita> => {
        const response: AxiosResponse<Receita> =
            await httpClient.get(resourceURL + 'receitaServico', {
                params: {
                    inicio: dataInicio,
                    fim: dataFim
                }
            });
        return response.data;
    };

    const receitaPorMes = async (ano: number, mes: number): Promise<Receita> => {
        const response: AxiosResponse<Receita> =
            await httpClient.get(`${resourceURL}receitaServico/mensal/${ano}/${mes}`);
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        // Operações de Despesas
        listarDespesas,
        buscarDespesaPorId,
        adicionarDespesas,
        atualizarDespesa,
        deletarDespesa,
        ValorTotalDespesa,

        // Operações de Categorias
        listarCategoriaDespesas,
        adicionarCategoria,
        atualizarCategoria,
        DeletarCategoria,

        // Operações de Receita
        receita,
        receitaPorPeriodo,
        receitaPorMes
    };
};
