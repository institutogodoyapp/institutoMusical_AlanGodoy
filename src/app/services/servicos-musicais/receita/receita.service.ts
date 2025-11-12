import { httpClient } from "@/app/http";
import { ResumoFinanceiro } from "@/app/models/escola/financeiro";
import { CategoriaDespesa, Despesas, DespesasCadastro, CategoriaDespesaCadastro } from "@/app/models/escola/financeiro/Despesas";
import { Receita } from "@/app/models/Servicos-musicais/receita";
import { CategoriaDespesaServico, CategoriaDespesaServicoCadastro, DespesasServico, DespesasServicoCadastro } from "@/app/models/Servicos-musicais/receita/despesa";
import { AxiosResponse } from "axios";

const resourceURL: string = '/admin/servicos-musicais/'

export const useReceitaServicoService = () => {

    // =========================================================================
    // OPERAÇÕES DE DESPESAS
    // =========================================================================

    const listarDespesas = async (): Promise<DespesasServico[]> => {
        try {
            const response: AxiosResponse<DespesasServico[]> = await httpClient.get<DespesasServico[]>(resourceURL + 'despesasServico')
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

    const buscarDespesaPorId = async (despesaId: number): Promise<DespesasServico> => {
        try {
            const response: AxiosResponse<DespesasServico> = await httpClient.get<DespesasServico>(resourceURL + `despesasServico/${despesaId}`)
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

    const adicionarDespesas = async (despesas: DespesasServico): Promise<DespesasServico> => {
        try {
            const response: AxiosResponse<DespesasServico> = await httpClient.post<DespesasServico>(resourceURL + 'despesasServico', despesas)
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

    const atualizarDespesa = async (despesaId: number, updates: Record<string, any>): Promise<DespesasServico> => {
        try {
            const response: AxiosResponse<DespesasServico> = await httpClient.patch(`${resourceURL}despesasServico/${despesaId}/parcial`, updates)
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

    const deletarDespesa = async (despesaId: number): Promise<void> => {
        try {
            await httpClient.delete(`${resourceURL}despesasServico/${despesaId}/deletar`)
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

    const ValorTotalDespesa = async (): Promise<number> => {
        try {
            const response: AxiosResponse<number> = await httpClient.get<number>(resourceURL + 'despesasServico' + '/total')
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
    // OPERAÇÕES DE CATEGORIAS
    // =========================================================================

    const listarCategoriaDespesas = async (): Promise<CategoriaDespesaServico[]> => {
        try {
            const response: AxiosResponse<CategoriaDespesaServico[]> = await httpClient.get<CategoriaDespesaServico[]>(resourceURL + 'categoriaServico')
            console.log("ategoria", response.data)
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

    const adicionarCategoria = async (categoria: CategoriaDespesaServicoCadastro): Promise<CategoriaDespesaServicoCadastro> => {
        try {
            const response: AxiosResponse<CategoriaDespesaServicoCadastro> = await httpClient.post<CategoriaDespesaServicoCadastro>(resourceURL + 'categoriaServico', categoria)
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

    const atualizarCategoria = async (categoriaId: number, updates: Record<string, any>): Promise<CategoriaDespesaServico> => {
        console.log(categoriaId)
        try {
            const response: AxiosResponse<CategoriaDespesaServico> = await httpClient.patch(`${resourceURL}categoriaServico/${categoriaId}/parcial`, updates)
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

    const DeletarCategoria = async (categoriaId: number): Promise<void> => {
        console.log(categoriaId)
        try {
            await httpClient.delete(`${resourceURL}categoriaServico/${categoriaId}`)
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
    // OPERAÇÕES DE RECEITA
    // =========================================================================

    const receita = async (): Promise<Receita> => {
        try {
            const response: AxiosResponse<Receita> = await httpClient.get<Receita>(resourceURL + 'receitaServico' + '/receita-do-mes')
            console.log("receita servico", response.data)
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

    const receitaPorPeriodo = async (dataInicio: string, dataFim: string): Promise<Receita> => {
        try {
            const response: AxiosResponse<Receita> = await httpClient.get<Receita>(resourceURL + 'receitaServico', {
                params: {
                    inicio: dataInicio,
                    fim: dataFim
                }
            })
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

    const receitaPorMes = async (ano: number, mes: number): Promise<Receita> => {
        try {
            const response: AxiosResponse<Receita> = await httpClient.get<Receita>(`${resourceURL}receitaServico/mensal/${ano}/${mes}`)
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
    }
}