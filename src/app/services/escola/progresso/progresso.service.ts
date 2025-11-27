import { httpClient } from '@/app/http/';
import { AxiosResponse } from 'axios';
import { ProgressoAluno, TopicoProgresso } from '@/app/models/escola/aluno/progresso';

const urlOfProgress = 'escola-musica/progresso';

export const useProgressoService = () => {

    // =========================================================================
    // OPERAÇÕES DE PROGRESSO DO ALUNO
    // =========================================================================

    const getAlunoProgresso = async (alunoId: number): Promise<ProgressoAluno> => {
        const response: AxiosResponse<ProgressoAluno> =
            await httpClient.get(`${urlOfProgress}/aluno/${alunoId}/resumo`);
            
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE TÓPICOS
    // =========================================================================

    const IniciarTopico = async (topicoId: number, alunoId: number): Promise<TopicoProgresso> => {
        const response: AxiosResponse<TopicoProgresso> =
            await httpClient.patch(`${urlOfProgress}/alunos/${alunoId}/topicos/${topicoId}/iniciar`);
        return response.data;
    };

    const concluirTopico = async (topicoId: number): Promise<TopicoProgresso> => {
        const response: AxiosResponse<TopicoProgresso> =
            await httpClient.patch(`${urlOfProgress}/topicos/${topicoId}/concluir`);
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getAlunoProgresso,
        IniciarTopico,
        concluirTopico
    };
};
