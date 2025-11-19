import { httpClient } from '@/app/http/';
import { Instrumento, InstrumentoCadastro } from '@/app/models/escola/instrumentos';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/escola-musica/instrumentos';

export const useInstrumentoService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE INSTRUMENTOS
    // =========================================================================

    const cadastrarInstrumento = async (instrumento: InstrumentoCadastro): Promise<InstrumentoCadastro> => {
        const response: AxiosResponse<InstrumentoCadastro> =
            await httpClient.post<InstrumentoCadastro>(resourceURL, instrumento);
        return response.data;
    };

    const getAllInstrumentos = async (): Promise<Instrumento[]> => {
        const response: AxiosResponse<Instrumento[]> =
            await httpClient.get<Instrumento[]>(resourceURL);
        return response.data;
    };

    const getAllInstrumentosConteudo = async (): Promise<Instrumento[]> => {
        const response: AxiosResponse<Instrumento[]> =
            await httpClient.get<Instrumento[]>(resourceURL);
        return response.data;
    };

    const getInstrumentoByProfessorId = async (professorId: number): Promise<Instrumento[]> => {
        const response: AxiosResponse<Instrumento[]> =
            await httpClient.get<Instrumento[]>(`${resourceURL}/professorId/${professorId}`);
        return response.data;
    };

    const AtualizarInstrumentos = async (instrumentoId: number, updates: Record<string, any>): Promise<InstrumentoCadastro> => {
        const response: AxiosResponse<InstrumentoCadastro> =
            await httpClient.patch<InstrumentoCadastro>(`${resourceURL}/${instrumentoId}/parcial`, updates);
        return response.data;
    };

    const removerInstrumento = async (instrumentoId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${instrumentoId}/deletar`);
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        cadastrarInstrumento,
        getAllInstrumentos,
        getAllInstrumentosConteudo,
        getInstrumentoByProfessorId,
        AtualizarInstrumentos,
        removerInstrumento
    };
};
