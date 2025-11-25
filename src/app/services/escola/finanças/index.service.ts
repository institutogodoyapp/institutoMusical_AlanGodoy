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
     
            const response: AxiosResponse<Despesas[]> = await httpClient.get<Despesas[]>(resourceURL + 'despesas')
            return response.data
  
    }

    const adicionarDespesas = async (despesas: DespesasCadastro): Promise<DespesasCadastro> => {

            const response: AxiosResponse<DespesasCadastro> = await httpClient.post<DespesasCadastro>(resourceURL + 'despesas', despesas)
            return response.data
      
    }

    const atualizarDespesa = async (despesaId: number, updates: Record<string, any>): Promise<Despesas> => {
  
            const response: AxiosResponse<Despesas> = await httpClient.patch(`${resourceURL}despesas/${despesaId}/parcial`, updates)
            return response.data
       
    }

    const deletarDespesa = async (despesaId: number): Promise<void> => {
       
            await httpClient.delete(`${resourceURL}despesas/${despesaId}/deletar`)
      
    }

    const ValorTotalDespesa = async (): Promise<number> => {
       
            const response: AxiosResponse<number> = await httpClient.get<number>(resourceURL + 'despesas' + '/total')
            return response.data
      
    }

    // =========================================================================
    // OPERAÇÕES DE CATEGORIAS
    // =========================================================================

    const listarCategoriaDespesas = async (): Promise<CategoriaDespesa[]> => {
     
            const response: AxiosResponse<CategoriaDespesa[]> = await httpClient.get<CategoriaDespesa[]>(resourceURL + 'categoria')
            return response.data
       
         
    }

    const adicionarCategoria = async (categoria: CategoriaDespesaCadastro): Promise<CategoriaDespesaCadastro> => {
            const response: AxiosResponse<CategoriaDespesaCadastro> = await httpClient.post<CategoriaDespesaCadastro>(resourceURL + 'categoria', categoria)
            return response.data
   
    }

    const atualizarCategoria = async (categoriaId: number, updates: Record<string, any>): Promise<CategoriaDespesa> => {

            const response: AxiosResponse<CategoriaDespesa> = await httpClient.patch(`${resourceURL}categoria/${categoriaId}/parcial`, updates)
            return response.data

    }

    const DeletarCategoria = async (categoriaId: number): Promise<void> => {
            await httpClient.delete(`${resourceURL}categoria/${categoriaId}`)
   
    }

    // =========================================================================
    // OPERAÇÕES DE RECEITA
    // =========================================================================

    const receita = async (): Promise<ResumoFinanceiro> => {
 
            const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(resourceURL + 'receita' + '/receita-do-mes')
            return response.data
    
    }

    const receitaPorPeriodo = async (dataInicio: string, dataFim: string): Promise<ResumoFinanceiro> => {
      
            const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(resourceURL + 'receita', {
                params: {
                    inicio: dataInicio,
                    fim: dataFim
                }
            })
            return response.data
      
    }

    const receitaPorMes = async (ano: number, mes: number): Promise<ResumoFinanceiro> => {
 
            const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(`${resourceURL}receita/receita-mes`, {
                params: {
                    ano: ano,
                    mes: mes
                }
            })
            return response.data
      
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