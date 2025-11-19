import { httpClient } from '@/app/http/';
import { MetricasEstoque, Produto, ProdutoAddEstoque, ProdutoForm } from '@/app/models/loja/produto';
import { Fornecedor, FornecedorForm } from '@/app/models/loja/venda';
import { AxiosResponse } from 'axios';

const resourceURL: string = '/admin/loja/produtos';

export const useProdutoService = () => {

    // =========================================================================
    // OPERAÇÕES DE PRODUTOS
    // =========================================================================

    const cadastrarProduto = async (produto: ProdutoForm): Promise<ProdutoForm> => {
        const response: AxiosResponse<ProdutoForm> =
            await httpClient.post<ProdutoForm>(resourceURL, produto);
        return response.data;
    };

    const atualizarProduto = async (produtoId: number, produto: ProdutoForm): Promise<ProdutoForm> => {
        const response: AxiosResponse<ProdutoForm> =
            await httpClient.put<ProdutoForm>(`${resourceURL}/${produtoId}/up`, produto);
        return response.data;
    };

    const buscarPorId = async (produtoId: number): Promise<Produto> => {
        const response: AxiosResponse<Produto> =
            await httpClient.get(`${resourceURL}/${produtoId}`);
        return response.data;
    };

    const getAllProducts = async (): Promise<Produto[]> => {
        const response: AxiosResponse<Produto[]> =
            await httpClient.get(resourceURL);
        return response.data;
    };

    const getAllProductsWithEstoque = async (): Promise<Produto[]> => {
        const response: AxiosResponse<Produto[]> =
            await httpClient.get(resourceURL + "/produtos-com-estoque");
        return response.data;
    };

    const desativarProduto = async (produtoId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${produtoId}/deletar`);
    };

    // =========================================================================
    // OPERAÇÕES DE ESTOQUE
    // =========================================================================

    const addEstoque = async (produtoId: number, quantidade: number): Promise<void> => {
        await httpClient.post(`${resourceURL}/${produtoId}/adicionar-estoque?quantidade=${quantidade}`);
    };

    const removeEstoque = async (produtoId: number, quantidade: number): Promise<void> => {
        await httpClient.post(`${resourceURL}/${produtoId}/remover-estoque?quantidade=${quantidade}`);
    };

    const getMetrics = async (): Promise<MetricasEstoque> => {
        const response: AxiosResponse<MetricasEstoque> =
            await httpClient.get(`${resourceURL}/metricasEstoque`);
        return response.data;
    };

    // =========================================================================
    // OPERAÇÕES DE FORNECEDORES
    // =========================================================================

    const cadastrarFornecedor = async (fornecedor: FornecedorForm): Promise<FornecedorForm> => {
        const response: AxiosResponse<FornecedorForm> =
            await httpClient.post(`${resourceURL}/fornecedor`, fornecedor);
        return response.data;
    };

    const getFornecedores = async (): Promise<Fornecedor> => {
        const response: AxiosResponse<Fornecedor> =
            await httpClient.get(`${resourceURL}/fornecedor`);
        return response.data;
    };

    const atualizarFornecedor = async (fornecedorId: number, fornecedor: FornecedorForm): Promise<FornecedorForm> => {
        const response: AxiosResponse<FornecedorForm> =
            await httpClient.put<FornecedorForm>(`${resourceURL}/${fornecedorId}/up-fornecedor`, fornecedor);
        return response.data;
    };

    const deletarFornecedor = async (fornecedorId: number): Promise<void> => {
        await httpClient.delete(`${resourceURL}/${fornecedorId}/deletar-fornecedor`);
    };

    // =========================================================================
    // EXPORTAÇÃO DE SERVIÇOS
    // =========================================================================

    return {
        // Operações de Produtos
        cadastrarProduto,
        atualizarProduto,
        buscarPorId,
        getAllProducts,
        getAllProductsWithEstoque,
        desativarProduto,

        // Operações de Estoque
        addEstoque,
        removeEstoque,
        getMetrics,

        // Operações de Fornecedores
        cadastrarFornecedor,
        getFornecedores,
        atualizarFornecedor,
        deletarFornecedor
    };
};
