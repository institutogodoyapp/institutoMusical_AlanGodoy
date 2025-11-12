export interface CategoriaResumo{
  categoria: string;
  total: number;
}

export interface ResumoFinanceiro {
  id: number;
  totalMensalidades: number;
  dataFim: string;
  dataInicio: string;
  custoTotal: number;
  receitaTotal: number;
   lucroTotal: number;
   despesaPorCategoria: CategoriaResumo[];
 
};  