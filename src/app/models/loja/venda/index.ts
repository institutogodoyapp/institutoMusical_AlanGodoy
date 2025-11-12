import { itemVenda } from "../itemVenda";

export interface Venda {
    id: number;
    clienteNome: string;
    produto: string;
    valorTotal: number;
    data: string;
    itens: itemVenda[];

}

export interface Fornecedor {
    id: number;
    nome: string;
    produtosEmEstoque: number;
}
export interface FornecedorForm {

    nome: string;
}

export interface MetricasVendas{
 faturamentoTotalAnual:  number;
  vendasRealizadas: number;
}

