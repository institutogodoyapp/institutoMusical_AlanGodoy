import { httpClient } from "@/app/http";
import { Disciplina, DisciplinaCadastro } from "@/app/models/escola/instrumentos/conteudoProgramatico/disciplina";
import { ConteudoProgramatico } from "@/app/models/escola/instrumentos/conteudoProgramatico";
import { AxiosResponse } from "axios";
import { Topico, TopicoCadastro } from "@/app/models/escola/instrumentos/conteudoProgramatico/topico";

const resourceURL: string = '/admin/escola-musica/conteudo-programatico';

export const useGradeService = () => {

    // =========================================================================
    // OPERAÇÕES DE DISCIPLINAS
    // =========================================================================

    const adicionarDiciplinas = async (disciplina: DisciplinaCadastro): Promise<DisciplinaCadastro> => {
        const response: AxiosResponse<DisciplinaCadastro> =
            await httpClient.post<DisciplinaCadastro>(`${resourceURL}/disciplinas`, disciplina);
        return response.data;
    };

    const atualizarDisciplina = async (disciplinaId: number, disciplina: Disciplina): Promise<Disciplina> => {
        const response: AxiosResponse<Disciplina> =
            await httpClient.put(`${resourceURL}/disciplinas/${disciplinaId}`, disciplina);
        return response.data;
    };

    const deletarDisciplina = async (disciplinaId: number) => {
        await httpClient.delete(`${resourceURL}/disciplinas/${disciplinaId}`);
    };

    // =========================================================================
    // OPERAÇÕES DE CONTEÚDO PROGRAMÁTICO
    // =========================================================================

    const buscarConteudoCompleto = async (instrumentoId: number): Promise<ConteudoProgramatico> => {
        const response: AxiosResponse<ConteudoProgramatico> =
            await httpClient.get(`${resourceURL}/instrumento/${instrumentoId}`);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE TÓPICOS
    // =========================================================================

    const adicionarTopicos = async (topico: TopicoCadastro): Promise<TopicoCadastro> => {
        const response: AxiosResponse<TopicoCadastro> =
            await httpClient.post<TopicoCadastro>(`${resourceURL}/topicos`, topico);
        return response.data;
    };

    const atualizaTopicos = async (topicoId: number, topico: TopicoCadastro): Promise<TopicoCadastro> => {
        const response: AxiosResponse<TopicoCadastro> =
            await httpClient.put(`${resourceURL}/topicos/${topicoId}`, topico);
        return response.data;
    };

    const deletarTopico = async (topicoId: number) => {
        await httpClient.delete(`${resourceURL}/topicos/${topicoId}`);
    };

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
    };
};
