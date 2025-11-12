

export interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
      observacao: string;
  ativo?: boolean;
    dataCadastro?: string;
  pedidosRealizados?: number;
  totalGasto?: number;
}
