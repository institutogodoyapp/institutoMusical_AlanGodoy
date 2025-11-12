import { httpClient } from "@/app/http";
import { ResumoFinanceiro } from "@/app/models/escola/financeiro";
import { Mensalidades, Config, ConfigPost, StatusMensalidade } from "@/app/models/escola/financeiro/mensalidade";
import { AxiosResponse } from "axios";

const resourceURL: string = '/admin/escola-musica/'

export const useMensalidadeService = () => {

    // =========================================================================
    // OPERAÇÕES DE MENSALIDADES
    // =========================================================================

    const listarMensalidadePorAluno = async (alunoId: number): Promise<Mensalidades[]> => {
        try {
            const response: AxiosResponse<Mensalidades[]> = await httpClient.get<Mensalidades[]>(`${resourceURL}mensalidade/${alunoId}`)
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

    const listarMensalidadesAberto = async (): Promise<Mensalidades[]> => {
        try {
            const response: AxiosResponse<Mensalidades[]> = await httpClient.get<Mensalidades[]>(`${resourceURL}mensalidade/nao-pagas`, 
                {
                params: {
                    mensalidade: StatusMensalidade.ABERTA
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

    const marcarPaga = async (mensalidadeId: number): Promise<Mensalidades> => {
        try {
            const response: AxiosResponse<Mensalidades> = await httpClient.put<Mensalidades>(`${resourceURL}mensalidade/${mensalidadeId}/pagar`)
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
    // OPERAÇÕES DE CONFIGURAÇÃO
    // =========================================================================

    const getConfig = async (): Promise<Config> => {
        try {
            const response: AxiosResponse<Config> = await httpClient.get<Config>(`${resourceURL}mensalidade/config/listar`)
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

    const postConfig = async (config: ConfigPost): Promise<Config> => {
        try {
            console.log(config)
            const response: AxiosResponse<ConfigPost> = await httpClient.post<ConfigPost>(`${resourceURL}mensalidade/config/criar`, config)
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
    // CÓDIGO COMENTADO (MANTIDO PARA REFERÊNCIA)
    // =========================================================================

    // const ValorTotalDespesa = async (): Promise<number> => {
    //     const response: AxiosResponse<number> = await httpClient.get<number>(resourceURL + 'despesas' + '/total')
    //     console.log(response.data)
    //     return response.data
    // }

    // const receita = async (): Promise<ResumoFinanceiro> => {
    //     const response: AxiosResponse<ResumoFinanceiro> = await httpClient.get<ResumoFinanceiro>(resourceURL + 'receita' + '/receita-do-mes')
    //     console.log(response.data)
    //     return response.data
    // }

    // const listarCategoriaDespesas = async (): Promise<CategoriaDespesa[]> => {
    //     const response: AxiosResponse<CategoriaDespesa[]> = await httpClient.get<CategoriaDespesa[]>(resourceURL + 'categoria')
    //     console.log("lista", response.data)
    //     return response.data
    // }

    // const adicionarCategoria = async (categoria: CategoriaDespesaCadastro): Promise<CategoriaDespesaCadastro> => {
    //     const response: AxiosResponse<CategoriaDespesaCadastro> = await httpClient.post<CategoriaDespesaCadastro>(resourceURL + 'categoria', categoria)
    //     return response.data
    // }

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        // Operações de Mensalidades
        listarMensalidadePorAluno,
        listarMensalidadesAberto,
        marcarPaga,
        
        // Operações de Configuração
        getConfig,
        postConfig
    }
}