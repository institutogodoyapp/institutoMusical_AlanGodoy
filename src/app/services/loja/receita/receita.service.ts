import { httpClient } from '@/app/http/'
import { Receita } from '@/app/models/loja/receita'
import { AxiosResponse } from 'axios'

const resourceURL: string = '/admin/loja/receita'

export const useReceitaService = () => {

    // =========================================================================
    // OPERAÇÕES DE RECEITA
    // =========================================================================

    const getReceitaMes = async (dataInicio: number, dataFim: number): Promise<Receita> => {
        try {
            console.log("huhuhu")

            const response: AxiosResponse<Receita> = await httpClient.get(`${resourceURL}/receita-do-mes`, {
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

    const getReceitaDoMes = async (ano: number, mes: number): Promise<Receita> => {
        try {
            console.log("huhuhu")
            
            const response: AxiosResponse<Receita> = await httpClient.get(`${resourceURL}/mensal/${ano}/${mes}`)
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

    const getReceitaFiltro = async (dataInicio: string, dataFim: string): Promise<Receita> => {
        try {
            console.log('chegueivvvv')

            const response: AxiosResponse<Receita> = await httpClient.get(`${resourceURL}`, {
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

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getReceitaMes,
        getReceitaDoMes,
        getReceitaFiltro
    }
}