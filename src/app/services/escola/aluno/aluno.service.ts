import { httpClient } from '@/app/http/'
import { Aluno } from '@/app/models/escola/aluno'
import { AxiosResponse } from 'axios'
import { aula } from '@/app/models/escola/aula'
import { ProgressoAluno } from '@/app/models/escola/aluno/progresso'
import { Matricula } from '@/app/models/escola/aluno/matricula'
import { DadosModal } from '@/components/common/modal/modal-generico'


const resourceURL: string = '/admin/escola-musica/'

export const useAlunoService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE ALUNOS
    // =========================================================================

    const cadastrarAluno = async (aluno: Aluno): Promise<Aluno> => {
        const response: AxiosResponse<Aluno> = await httpClient.post<Aluno>(
            resourceURL + 'alunos',
            aluno
        )
        return response.data
    }

    const getAlunoById = async (alunoId: number): Promise<Aluno> => {
        const response: AxiosResponse<Aluno> = await httpClient.get<Aluno>(
            `${resourceURL}/${alunoId}`
        )
        return response.data
    }

    const getAlunos = async (): Promise<Aluno[]> => {
        const response: AxiosResponse<Aluno[]> = await httpClient.get<Aluno[]>(
            resourceURL + 'alunos'
        )
        return response.data
    }

    const carregarAluno = async (id: number): Promise<Aluno> => {
        const url: string = `${resourceURL}alunos/${id}`
        const response: AxiosResponse<Aluno> = await httpClient.get(url)
        return response.data
    }

    const atualizarAluno = async (alunoId: number, aluno: Aluno): Promise<Aluno> => {
        const response: AxiosResponse<Aluno> = await httpClient.patch(
            `${resourceURL}alunos/${alunoId}/parcial`,
            aluno
        )
        return response.data
    }

    const removerAluno = async (alunoId: number): Promise<void> => {
        const response: AxiosResponse<ProgressoAluno> = await httpClient.delete(
            `${resourceURL}alunos/${alunoId}`
        )
    }

    // =========================================================================
    // OPERAÇÕES DE PROGRESSO E AULAS
    // =========================================================================

    const getAlunoProgresso = async (alunoId: number): Promise<ProgressoAluno[]> => {
        const response: AxiosResponse<ProgressoAluno[]> = await httpClient.get(
            `${resourceURL}alunos/${alunoId}/progresso`
        )

        return response.data
    }

    const getAulasSemana = async (): Promise<aula[]> => {
        const response: AxiosResponse<aula[]> = await httpClient.get<aula[]>(
            resourceURL + 'aula/semana'
        )
        return response.data
    }



    // =========================================================================
    // OPERAÇÕES DE MATRICULA
    // =========================================================================

    const cancelarMatricula = async (id: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}alunos/matricula/${id}`)
    }

    const matricular = async (matricula: DadosModal): Promise<Matricula> => {

        const response: AxiosResponse<Matricula> = await httpClient.post(`${resourceURL}alunos/matricula`, matricula)
        return response.data
    }


    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        // Operações CRUD
        cadastrarAluno,
        getAlunos,
        getAlunoById,
        carregarAluno,
        atualizarAluno,
        removerAluno,

        // Operações de progresso e aulas
        getAlunoProgresso,
        getAulasSemana,


        cancelarMatricula,
        matricular
    }
}