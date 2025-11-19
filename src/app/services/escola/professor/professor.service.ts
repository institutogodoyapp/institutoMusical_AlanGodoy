import { httpClient } from '@/app/http/';
import { Professor, ProfessorCadastro } from '@/app/models/escola/professor';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/escola-musica/professores';

export const useProfessorService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE PROFESSORES
    // =========================================================================

    const cadastrarProfessor = async (professor: ProfessorCadastro): Promise<ProfessorCadastro> => {
        const response: AxiosResponse<ProfessorCadastro> =
            await httpClient.post<ProfessorCadastro>(resourceURL, professor);
        return response.data;
    };

    const getAllProfessores = async (): Promise<Professor[]> => {
        const response: AxiosResponse<Professor[]> =
            await httpClient.get<Professor[]>(resourceURL);
        return response.data;
    };

    const getProfessor = async (professorId: number): Promise<Professor> => {
        const response: AxiosResponse<Professor> =
            await httpClient.get<Professor>(`${resourceURL}/${professorId}/professor`);
        return response.data;
    };

    const atualizarProfessor = async (professorId: number, professor: ProfessorCadastro): Promise<ProfessorCadastro> => {
        const response: AxiosResponse<ProfessorCadastro> =
            await httpClient.put<ProfessorCadastro>(`${resourceURL}/${professorId}/update`, professor);
        return response.data;
    };

    const exluirProfessor = async (professorId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${professorId}/deletar`);
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        cadastrarProfessor,
        getAllProfessores,
        getProfessor,
        atualizarProfessor,
        exluirProfessor
    };
};
