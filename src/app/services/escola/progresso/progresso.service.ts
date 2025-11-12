import { httpClient } from '@/app/http/'
import { AxiosResponse } from 'axios'
import { Aluno } from '@/app/models/escola/aluno'
import { ProgressoAluno, TopicoProgresso } from '@/app/models/escola/aluno/progresso'

const resourceURL: string = '/admin/escola-musica/'
const urlOfProgress = 'escola-musica/progresso'

export const useProgressoService = () => {

    // =========================================================================
    // OPERAÇÕES DE PROGRESSO DO ALUNO
    // =========================================================================

    const getAlunoProgresso = async (alunoId: number): Promise<ProgressoAluno> => {
        try {
            const response: AxiosResponse<ProgressoAluno> = await httpClient.get(`${urlOfProgress}/aluno/${alunoId}/resumo`)
            console.log("oiii", response)
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

    const IniciarTopico = async (topicoId: number, alunoId: number): Promise<TopicoProgresso> => {
        try {
            const response: AxiosResponse<TopicoProgresso> = await httpClient.patch(`${urlOfProgress}/alunos/${alunoId}/topicos/${topicoId}/iniciar`)
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

    const concluirTopico = async (topicoId: number): Promise<TopicoProgresso> => {
        try {
            const response: AxiosResponse<TopicoProgresso> = await httpClient.patch(`${urlOfProgress}/topicos/${topicoId}/concluir`)
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

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getAlunoProgresso,
        IniciarTopico,
        concluirTopico
    }
}