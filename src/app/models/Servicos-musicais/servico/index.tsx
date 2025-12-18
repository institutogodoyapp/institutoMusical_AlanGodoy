import { CategoriaServico } from "../categoria-servico";


export interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
  
categoria: CategoriaServico
    observacao: string;
categoriaNome: string
    categoriaId: number
}

export interface ServicoForm {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    observacao: string;
    categoriaId: number
}

interface ServicoMusical {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  categoria: string;
  status: 'ativo' | 'inativo';
  clientesAtivos: number;
}

export interface MetricasServico{
    totalServicos: number;
    clientes: number;
    faturamentoTotalAnual:  number;
}

