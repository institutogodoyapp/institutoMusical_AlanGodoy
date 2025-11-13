import { httpClient } from "@/app/http";
import { ResumoFinanceiro } from "@/app/models/escola/financeiro";
import { CategoriaDespesa, Despesas, DespesasCadastro, CategoriaDespesaCadastro } from "@/app/models/escola/financeiro/Despesas";
import { AxiosResponse } from "axios";

const resourceURL: string = '/admin/escola-musica/'

export const useFinancasService = () => {

    // =========================================================================
    // OPERAÇÕES DE DESPESAS
    // =========================================================================

    const listarDespesas = async (): Promise<Despesas[]> => {
        try {
            const response: AxiosResponse<Despesas[]> = await httpClient.get<Despesas[]>(resourceURL + 'despesas')
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

    const adicionarDespesas = async (despesas: DespesasCadastro): Promise<DespesasCadastro> => {
        try {
            const response: AxiosResponse<DespesasCadastro> = await httpClient.post<DespesasCadastro>(resourceURL + 'despesas', despesas)
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

    const atualizarDespesa = async (despesaId: number, updates: Record<string, any>): Promise<Despesas> => {
        try {
            const response: AxiosResponse<Despesas> = await httpClient.patch(`${resourceURL}despesas/${despesaId}/parcial`, updates)
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
            await httpClient.delete(`${resourceURL}despesas/${despesaId}/deletar`)
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
            const response: AxiosResponse<number> = await httpClient.get<number>(resourceURL + 'despesas' + '/total')
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

    const listarCategoriaDespesas = async (): Promise<CategoriaDespesa[]> => {
        try {
            const response: AxiosResponse<CategoriaDespesa[]> = await httpClient.get<CategoriaDespesa[]>(resourceURL + 'categoria')
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

    const adicionarCategoria = async (categoria: CategoriaDespesaCadastro): Promise<CategoriaDespesaCadastro> => {
        try {
            const response: AxiosResponse<CategoriaDespesaCadastro> = await httpClient.post<CategoriaDespesaCadastro>(resourceURL + 'categoria', categoria)
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

    const atualizarCategoria = async (categoriaId: number, updates: Record<string, any>): Promise<CategoriaDespesa> => {
        console.log(categoriaId)
        try {
            const response: AxiosResponse<CategoriaDespesa> = await httpClient.patch(`${resourceURL}categoria/${categoriaId}/parcial`, updates)
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
            await httpClient.delete(`${resourceURL}categoria/${categoriaId}`)
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

    const receita = async (): Promise<ResumoFinanceiro> => {
        try {
            const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(resourceURL + 'receita' + '/receita-do-mes')
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

    const receitaPorPeriodo = async (dataInicio: string, dataFim: string): Promise<ResumoFinanceiro> => {
        try {
            const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(resourceURL + 'receita', {
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

    const receitaPorMes = async (ano: number, mes: number): Promise<ResumoFinanceiro> => {
        try {
            const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(`${resourceURL}receita/receita-mes`, {
                params: {
                    ano: ano,
                    mes: mes
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

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        // Operações de Despesas
        listarDespesas,
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