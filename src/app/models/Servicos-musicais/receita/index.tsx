import { CategoriaResumoServico } from "./despesa";

export interface Receita {
    receitaTotal: number;
    custoTotal: number;
    lucroTotal: number;
    dataInicio: string;
    dataFim: string;
    pedidosConcluidos: number;
    mes: string;
    despesaPorCategoria: CategoriaResumoServico[];
}