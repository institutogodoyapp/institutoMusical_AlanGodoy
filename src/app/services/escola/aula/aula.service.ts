import { httpClient } from '@/app/http/'
import { Axios, AxiosResponse } from 'axios'

import { Reposicao, StatusReposicao } from '@/app/models/escola/reposicao'
import { AulaForm, AulaObs } from '@/app/models/escola/aula'
import { DadosModal } from '@/components/common/modal/modal-generico'

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

        const getAulasPorProfessor = async (
                professorId: number,
                dataInicio: string,
                dataFim: string
        ): Promise<AulaForm> => {
                const inicioLocalDateTime = dataInicio.includes('T')
                        ? dataInicio
                        : `${dataInicio}T00:00:00`;

                const fimLocalDateTime = dataFim.includes('T')
                        ? dataFim
                        : `${dataFim}T23:59:59`;
                const response: AxiosResponse<AulaForm> = await httpClient.get(
                        `${resourceURL}aula/${professorId}/aulasProfessor`,
                        {
                                params: {
                                        dataInicio: inicioLocalDateTime, // Já deve estar no formato ISO string
                                        dataFim: fimLocalDateTime       // Já deve estar no formato ISO string
                                }
                        }
                );

               
                return response.data;
        };

        const salvarObservacao = async (observacao: DadosModal, aulaId: number): Promise<AulaForm> => {

                const response: AxiosResponse<AulaForm> = await httpClient.patch(`${resourceURL}aula/${aulaId}/observacoes`, observacao)
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
                cancelarReposicao,
                salvarObservacao
        }
}