import { httpClient } from '@/app/http/'
import { MetricasEstoque, Produto, ProdutoAddEstoque, ProdutoForm } from '@/app/models/loja/produto';
import { Fornecedor, FornecedorForm } from '@/app/models/loja/venda';
import { AxiosResponse } from 'axios'
import { AxiosError } from 'axios';

const resourceURL: string = '/admin/loja/produtos'

export const useProdutoService = () => {

    // =========================================================================
    // OPERAÇÕES DE PRODUTOS
    // =========================================================================

    const cadastrarProduto = async (produto: ProdutoForm): Promise<ProdutoForm> => {
        try {
            const response: AxiosResponse<ProdutoForm> = await httpClient.post<ProdutoForm>(resourceURL, produto)
            console.log(response.status)
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

    const atualizarProduto = async (produtoId: number, produto: ProdutoForm): Promise<ProdutoForm> => {
        try {
            const response: AxiosResponse<ProdutoForm> = await httpClient.put<ProdutoForm>(`${resourceURL}/${produtoId}/up`, produto)
            console.log(response.status)
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

    const buscarPorId = async (produtoId: number): Promise<Produto> => {
        try {
            const response: AxiosResponse<Produto> = await httpClient.get(`${resourceURL}/${produtoId}`)
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

    const getAllProducts = async (): Promise<Produto[]> => {
        try {
            const response: AxiosResponse<Produto[]> = await httpClient.get(resourceURL)
            console.log(response.data)
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

    const getAllProductsWithEstoque = async (): Promise<Produto[]> => {
        try {
            const response: AxiosResponse<Produto[]> = await httpClient.get(resourceURL + "/produtos-com-estoque")
            console.log(response.data)
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

    const desativarProduto = async (produtoId: number): Promise<void> => {
        console.log("removendo")
        try {
            const response: AxiosResponse<void> = await httpClient.delete(`${resourceURL}/${produtoId}/deletar`)
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

    // =========================================================================
    // OPERAÇÕES DE ESTOQUE
    // =========================================================================

    const addEstoque = async (produtoId: number, quantidade: number): Promise<void> => {
        console.log(produtoId, quantidade)
        try {
            const response: AxiosResponse<void> = await httpClient.post(`${resourceURL}/${produtoId}/adicionar-estoque?quantidade=${quantidade}`)
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

    const removeEstoque = async (produtoId: number, quantidade: number): Promise<void> => {
        console.log("removendo")
        try {
            const response: AxiosResponse<void> = await httpClient.post(`${resourceURL}/${produtoId}/remover-estoque?quantidade=${quantidade}`)
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

    const getMetrics = async (): Promise<MetricasEstoque> => {
        try {
            const response: AxiosResponse<MetricasEstoque> = await httpClient.get(`${resourceURL}/metricasEstoque`)
            console.log(response.data)
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

    // =========================================================================
    // OPERAÇÕES DE FORNECEDORES
    // =========================================================================

    const cadastrarFornecedor = async (fornecedor: FornecedorForm): Promise<FornecedorForm> => {
        try {
            const response: AxiosResponse<FornecedorForm> = await httpClient.post(`${resourceURL}/fornecedor`, fornecedor)
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

    const getFornecedores = async (): Promise<Fornecedor> => {
        try {
            const response: AxiosResponse<Fornecedor> = await httpClient.get(`${resourceURL}/fornecedor`)
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

    const atualizarFornecedor = async (fornecedorId: number, fornecedor: FornecedorForm): Promise<FornecedorForm> => {
        try {
            const response: AxiosResponse<FornecedorForm> = await httpClient.put<FornecedorForm>(`${resourceURL}/${fornecedorId}/up-fornecedor`, fornecedor)
            console.log(response.status)
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

    const deletarFornecedor = async (fornecedorId: number): Promise<void> => {
        console.log("removendo")
        try {
            const response: AxiosResponse<void> = await httpClient.delete(`${resourceURL}/${fornecedorId}/deletar-fornecedor`)
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
    }
}