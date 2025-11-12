// @/app/services/escola/config-agenda/config-agenda.service.ts
import { httpClient } from '@/app/http/'
import { Axios, AxiosResponse } from 'axios'
import { aula } from '@/app/models/escola/aula'
import { ProgressoAluno, TopicoProgresso } from '@/app/models/escola/aluno/progresso'
import { Reposicao, StatusReposicao } from '@/app/models/escola/reposicao'
import { AulaForm } from '@/app/models/escola/aula'
import { ConfigAgenda } from '@/app/models/escola/aula/configAgenda'

const BASE_URL: string = '/admin/escola-musica/config-agenda'


export const useConfigAgendaService = () => {


    const getConfig = async (): Promise<ConfigAgenda> => {
        try {
            const url = BASE_URL;
            const response: AxiosResponse<ConfigAgenda> = await httpClient.get(url);
            console.log(response)
            return response.data;
        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }

    };

    const updateConfig = async (config: ConfigAgenda): Promise<ConfigAgenda> => {
        console.log("config:", config)
        try {
            const url =  BASE_URL;
            const response: AxiosResponse<ConfigAgenda> = await httpClient.put(url, config);
            return response.data;

        }
        catch (error: any) {
            if (error.response?.data) {
                console.log(error)
                throw new Error(error.response.data)
            } else {

            }
            throw new Error("Erro de Conexão com o servidor")
        }
    };

    const getDefaultConfig = (): ConfigAgenda => {
        return {
           
            horaInicio: '08:00',
            horaFim: '18:00',
            duracaoAulaMinutos: 60
        };
    };

    return {
        getConfig,
        updateConfig,
        getDefaultConfig
    };
};