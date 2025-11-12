import { httpClient } from '@/app/http/';
import { Instrumento, InstrumentoCadastro } from '@/app/models/escola/instrumentos';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/escola-musica/instrumentos';

export const useInstrumentoService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE INSTRUMENTOS
    // =========================================================================

    const cadastrarInstrumento = async (instrumento: InstrumentoCadastro): Promise<InstrumentoCadastro> => {
        try {
            const response: AxiosResponse<InstrumentoCadastro> = await httpClient.post<InstrumentoCadastro>(resourceURL, instrumento)
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

    const getAllInstrumentos = async (): Promise<Instrumento[]> => {
        try {
            const response: AxiosResponse<Instrumento[]> = await httpClient.get<Instrumento[]>(resourceURL)
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

    const getAllInstrumentosConteudo = async (): Promise<Instrumento[]> => {
        try {
            const response: AxiosResponse<Instrumento[]> = await httpClient.get<Instrumento[]>(resourceURL)
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

    const AtualizarInstrumentos = async (instrumentoId: number, updates: Record<string, any>): Promise<InstrumentoCadastro> => {
        try {
            console.log("sou eu", updates)
            
            const response: AxiosResponse<InstrumentoCadastro> = await httpClient.patch<InstrumentoCadastro>(
                `${resourceURL}/${instrumentoId}/parcial`,
                updates
            )

            console.log("sou eu", response)
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

    const removerInstrumento = async (instrumentoId: number): Promise<void> => {
        try {
            await httpClient.delete(`${resourceURL}/${instrumentoId}/deletar`)
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
        cadastrarInstrumento,
        getAllInstrumentos,
        getAllInstrumentosConteudo,
        AtualizarInstrumentos,
        removerInstrumento
    }
}