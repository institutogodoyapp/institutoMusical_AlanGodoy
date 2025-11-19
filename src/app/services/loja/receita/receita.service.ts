import { httpClient } from '@/app/http/';
import { Receita } from '@/app/models/loja/receita';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/loja/receita';

export const useReceitaService = () => {

    // =========================================================================
    // OPERAÇÕES DE RECEITA
    // =========================================================================

    const getReceitaMes = async (dataInicio: number, dataFim: number): Promise<Receita> => {
        const response: AxiosResponse<Receita> =
            await httpClient.get(`${resourceURL}/receita-do-mes`, {
                params: {
                    inicio: dataInicio,
                    fim: dataFim
                }
            });
        return response.data;
    };

    const getReceitaDoMes = async (ano: number, mes: number): Promise<Receita> => {
        const response: AxiosResponse<Receita> =
            await httpClient.get(`${resourceURL}/mensal/${ano}/${mes}`);
        return response.data;
    };

    const getReceitaFiltro = async (dataInicio: string, dataFim: string): Promise<Receita> => {
        const response: AxiosResponse<Receita> =
            await httpClient.get(`${resourceURL}`, {
                params: {
                    inicio: dataInicio,
                    fim: dataFim
                }
            });
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        getReceitaMes,
        getReceitaDoMes,
        getReceitaFiltro
    };
};
