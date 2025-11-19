import { httpClient } from "@/app/http";

import { Mensalidades, Config, ConfigPost, StatusMensalidade } from "@/app/models/escola/financeiro/mensalidade";
import { AxiosResponse } from "axios";

const resourceURL: string = '/admin/escola-musica/'

export const useMensalidadeService = () => {

    // =========================================================================
    // OPERAÇÕES DE MENSALIDADES
    // =========================================================================

    const listarMensalidadePorAluno = async (alunoId: number): Promise<Mensalidades[]> => {
        const response: AxiosResponse<Mensalidades[]> = await httpClient.get<Mensalidades[]>(`${resourceURL}mensalidade/${alunoId}`);
        return response.data;
    };

    const listarMensalidadesAberto = async (): Promise<Mensalidades[]> => {
        const response: AxiosResponse<Mensalidades[]> = await httpClient.get<Mensalidades[]>(`${resourceURL}mensalidade/nao-pagas`, {
            params: {
                mensalidade: StatusMensalidade.ABERTA
            }
        });
        return response.data;
    };

    const marcarPaga = async (mensalidadeId: number): Promise<Mensalidades> => {
        const response: AxiosResponse<Mensalidades> = await httpClient.put<Mensalidades>(`${resourceURL}mensalidade/${mensalidadeId}/pagar`);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE CONFIGURAÇÃO
    // =========================================================================

    const getConfig = async (): Promise<Config> => {
        const response: AxiosResponse<Config> = await httpClient.get<Config>(`${resourceURL}mensalidade/config/listar`);
        return response.data;
    };

    const postConfig = async (config: ConfigPost): Promise<Config> => {
        const response: AxiosResponse<ConfigPost> = await httpClient.post<ConfigPost>(`${resourceURL}mensalidade/config/criar`, config);
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        listarMensalidadePorAluno,
        listarMensalidadesAberto,
        marcarPaga,

        getConfig,
        postConfig
    };
};
