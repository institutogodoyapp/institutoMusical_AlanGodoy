import { httpClient } from '@/app/http/'
import { AxiosResponse } from 'axios'

import { Reposicao, StatusReposicao } from '@/app/models/escola/reposicao'
import { AulaForm } from '@/app/models/escola/aula'

const resourceURL: string = '/admin/escola-musica/'

export const useAulaService = () => {

    // =========================================================================
    // OPERAÇÕES DE AULA
    // =========================================================================

    const getAllLessons = async (): Promise<AulaForm> => {

            const response: AxiosResponse<AulaForm> = await httpClient.get(`${resourceURL}aula/todas`)
            return response.data
     
    }

    const getAulaPorId = async (aulaId: number): Promise<AulaForm> => {
      
            const response: AxiosResponse<AulaForm> = await httpClient.get(`${resourceURL}aula/${aulaId}`)
            return response.data
     
    }

    const getAulasPorProfessor = async (professorId: number): Promise<AulaForm> => {

            const response: AxiosResponse<AulaForm> = await httpClient.get(`${resourceURL}aula/${professorId}/aulasProfessor`)
            return response.data
   
    }


    // =========================================================================
    // OPERAÇÕES DE REPOSIÇÃO
    // =========================================================================

    const marcarReposicao = async (reposicao: Reposicao): Promise<Reposicao> => {
     
            const response: AxiosResponse<Reposicao> = await httpClient.post(
                `${resourceURL}reposicao/marcar`,
                reposicao
            )
            return response.data
     
    }

    const getReposições = async (professorId: number): Promise<Reposicao[]> => {
   
            const response: AxiosResponse<Reposicao[]> = await httpClient.get(`${resourceURL}reposicao/professor/${professorId}`)
            return response.data
    
    }

    const getAllReposições = async (): Promise<Reposicao[]> => {

            const response: AxiosResponse<Reposicao[]> = await httpClient.get(`${resourceURL}all`)
            return response.data
    
    }

    const cancelarReposicao = async (reposiçãoId: number, statusReposicao: StatusReposicao): Promise<Reposicao> => {

        const response: AxiosResponse<Reposicao> = await httpClient.put(
            `${resourceURL}reposicao/${reposiçãoId}/status?novoStatus=${statusReposicao}`
        )
        return response.data


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
        getAllReposições,
        cancelarReposicao
    }
}