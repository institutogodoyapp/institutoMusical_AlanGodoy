import { httpClient } from "@/app/http"
import { Disciplina, DisciplinaCadastro } from "@/app/models/escola/instrumentos/conteudoProgramatico/disciplina"
import { ConteudoProgramatico } from "@/app/models/escola/instrumentos/conteudoProgramatico"
import { AxiosResponse } from "axios"
import { Topico, TopicoCadastro } from "@/app/models/escola/instrumentos/conteudoProgramatico/topico"

const resourceURL: string = '/admin/escola-musica/conteudo-programatico'

export const useGradeService = () => {

    // =========================================================================
    // OPERAÇÕES DE DISCIPLINAS
    // =========================================================================

    const adicionarDiciplinas = async (disciplina: DisciplinaCadastro): Promise<DisciplinaCadastro> => {
        try {
            const response: AxiosResponse<DisciplinaCadastro> = await httpClient.post<DisciplinaCadastro>(`${resourceURL}/disciplinas`, disciplina)
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

    const atualizarDisciplina = async (disciplinaId: number, disciplina: Disciplina): Promise<Disciplina> => {
        try {
            const response: AxiosResponse<Disciplina> = await httpClient.put(`${resourceURL}/disciplinas/${disciplinaId}`, disciplina)
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

    const deletarDisciplina = async (disciplinaId: number) => {
        try {
            const response: AxiosResponse<DisciplinaCadastro> = await httpClient.delete(`${resourceURL}/disciplinas/${disciplinaId}`)
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
    // OPERAÇÕES DE CONTEÚDO PROGRAMÁTICO
    // =========================================================================

    const buscarConteudoCompleto = async (instrumentoId: number): Promise<ConteudoProgramatico> => {
        try {
            const response: AxiosResponse<ConteudoProgramatico> = await httpClient.get(`${resourceURL}/instrumento/${instrumentoId}`)
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
    // OPERAÇÕES DE TÓPICOS
    // =========================================================================

    const adicionarTopicos = async (topico: TopicoCadastro): Promise<TopicoCadastro> => {
        try {
            const response: AxiosResponse<TopicoCadastro> = await httpClient.post<TopicoCadastro>(`${resourceURL}/topicos`, topico)
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

    const atualizaTopicos = async (topicoId: number, topico: TopicoCadastro): Promise<TopicoCadastro> => {
        try {
            const response: AxiosResponse<TopicoCadastro> = await httpClient.put(`${resourceURL}/topicos/${topicoId}`, topico)
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

    const deletarTopico = async (topicoId: number) => {
        try {
            const response: AxiosResponse<Topico> = await httpClient.delete(`${resourceURL}/topicos/${topicoId}`)
            console.log(response.data)
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
        // Operações de Disciplinas
        adicionarDiciplinas,
        atualizarDisciplina,
        deletarDisciplina,
        
        // Operações de Conteúdo Programático
        buscarConteudoCompleto,
        
        // Operações de Tópicos
        adicionarTopicos,
        atualizaTopicos,
        deletarTopico
    }
}