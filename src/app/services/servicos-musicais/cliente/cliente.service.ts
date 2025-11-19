import { httpClient } from '@/app/http/';
import { Cliente } from '@/app/models/Servicos-musicais/cliente';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/servicos-musicais/clientes';

export const useClienteService = () => {

    // =========================================================================
    // OPERAÇÕES CRUD DE CLIENTES
    // =========================================================================

    const salvarCliente = async (cliente: Cliente): Promise<Cliente> => {
        const response: AxiosResponse<Cliente> =
            await httpClient.post(resourceURL, cliente);
        return response.data;
    };

    const deletar = async (clienteId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${clienteId}`);
    };

    const atualizarCliente = async (clienteId: number, updates: Record<string, any>): Promise<Cliente> => {
        const response: AxiosResponse<Cliente> =
            await httpClient.patch(`${resourceURL}/${clienteId}/parcial`, updates);
        return response.data;
    };

    const getClient = async (): Promise<Cliente[]> => {
        const response: AxiosResponse<Cliente[]> =
            await httpClient.get(resourceURL);
        return response.data;
    };

    const getClientById = async (clienteId: number): Promise<Cliente> => {
        const response: AxiosResponse<Cliente> =
            await httpClient.get(`${resourceURL}/${clienteId}/cliente`);
        return response.data;
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        salvarCliente,
        atualizarCliente,
        deletar,
        getClient,
        getClientById
    };
};
