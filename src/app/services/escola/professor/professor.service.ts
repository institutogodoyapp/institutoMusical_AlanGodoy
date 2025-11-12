import { httpClient } from '@/app/http/';
import { Professor, ProfessorCadastro } from '@/app/models/escola/professor';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/escola-musica/professores';

export const useProfessorService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE PROFESSORES
    // =========================================================================

    const cadastrarProfessor = async (professor: ProfessorCadastro): Promise<ProfessorCadastro> => {
        try {
            const response: AxiosResponse<ProfessorCadastro> = await httpClient.post<ProfessorCadastro>(resourceURL, professor)
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

    const getAllProfessores = async (): Promise<Professor[]> => {
        try {
            const response: AxiosResponse<Professor[]> = await httpClient.get<Professor[]>(resourceURL)
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
        const getProfessor = async (professorId: number): Promise<Professor> => {
        try {
            const response: AxiosResponse<Professor> = await httpClient.get<Professor>(`${resourceURL}/${professorId}/professor`)
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

    const atualizarProfessor = async (professorId: number, professor: ProfessorCadastro): Promise<ProfessorCadastro> => {
        try {
            const response: AxiosResponse<ProfessorCadastro> = await httpClient.put<ProfessorCadastro>(
                `${resourceURL}/${professorId}/update`,
                professor
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

    const exluirProfessor = async (professorId: number): Promise<void> => {
        try {
            const response: AxiosResponse<Professor> = await httpClient.delete(`${resourceURL}/${professorId}/deletar`)
            console.log(response)
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
        cadastrarProfessor,
        getAllProfessores,
        getProfessor,
        atualizarProfessor,
        exluirProfessor
    }
}