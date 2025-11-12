import { httpClient } from '@/app/http/'
import { Axios, AxiosResponse } from 'axios'
import { aula } from '@/app/models/escola/aula'
import { ProgressoAluno, TopicoProgresso } from '@/app/models/escola/aluno/progresso'
import { Reposicao, StatusReposicao } from '@/app/models/escola/reposicao'
import { AulaForm } from '@/app/models/escola/aula'

const resourceURL: string = '/admin/escola-musica/'
const urlOfProgress = 'escola-musica/progresso'

export const useAulaService = () => {

    // =========================================================================
    // OPERAÇÕES DE AULA
    // =========================================================================

    const getAllLessons = async (): Promise<AulaForm> => {
        try {
            const response: AxiosResponse<AulaForm> = await httpClient.get(`${resourceURL}aula/todas`)
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

    const getAulaPorId = async (aulaId: number): Promise<AulaForm> => {
        try {
            const response: AxiosResponse<AulaForm> = await httpClient.get(`${resourceURL}aula/${aulaId}`)
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

        const getAulasPorProfessor = async (professorId: number): Promise<AulaForm> => {
        try {
            const response: AxiosResponse<AulaForm> = await httpClient.get(`${resourceURL}aula/${professorId}/aulasProfessor`)
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
    // OPERAÇÕES DE REPOSIÇÃO
    // =========================================================================

    const marcarReposicao = async (reposicao: Reposicao): Promise<Reposicao> => {
        try {
            const response: AxiosResponse<Reposicao> = await httpClient.post(
                `${resourceURL}reposicao/marcar`, 
                reposicao
            )
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

    const getReposições = async (professorId: number): Promise<Reposicao[]> => {
        try {
            const response: AxiosResponse<Reposicao[]> = await httpClient.get(`${resourceURL}reposicao/professor/${professorId}`)
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

    const cancelarReposicao = async (reposiçãoId: number, statusReposicao: StatusReposicao): Promise<Reposicao> => {
        try {
            const response: AxiosResponse<Reposicao> = await httpClient.put(
                `${resourceURL}reposicao/${reposiçãoId}/status?novoStatus=${statusReposicao}`
            )
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
        // Operações de Aula
        getAllLessons,
        getAulaPorId,
         getAulasPorProfessor,
        // Operações de Reposição
        marcarReposicao,
        getReposições,
        cancelarReposicao
    }
}