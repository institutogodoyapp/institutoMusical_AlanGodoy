import { MovimentacaoEstoque } from "../movimentacao-estoque";
import { Fornecedor } from "../venda";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  custo: number;
  precoVenda: number;
  quantidadeEstoque: number;
  movimentacoes?: MovimentacaoEstoque[]
  ativo: boolean
  fornecedor: Fornecedor;
  sku: string;
  estoqueMinimo: number;
  dataCadastro: string;

}

export interface ProdutoForm {
  id: number;
  nome: string;
  descricao: string;
  custo: number;
  precoVenda: number;
  quantidadeEstoque: number;
  movimentacoes?: MovimentacaoEstoque[]
  dataCadastro?: string;
  fornecedor?: Fornecedor;
  fornecedorId: number;
  sku: string;
  estoqueMinimo: number;

}

export interface ProdutoAddEstoque {
  id: number;

  quantidadeEstoque: number;


}

export interface MetricasEstoque {
  valorTotalEstoque: number;
  totalProdutos: number;
  produtosEstoqueBaixo: number;
  produtosForaEstoque: number;
}
