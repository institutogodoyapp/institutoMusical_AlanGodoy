


export interface CategoriaDespesaServico {

    id: number;
    nome: string;
    descricao: string;
    ativo: boolean;
    despesas: DespesasServico;
        comDespesa: boolean;
}

export interface DespesasServico {
    id: number;
    descricao: string;
    ativo: boolean;
    data: string;
    valor: number;
    categoria: CategoriaDespesaServico;
    categoriaNome: string;
    categoriaId: number;
}

export interface DespesasServicoCadastro {
id: number;
    descricao: string;
    data: string;
    valor: number;
    categoriaId: number;

}

export interface CategoriaDespesaServicoCadastro {
    id: number;
    nome: string;
    descricao: string;
    comDespesa?: boolean;

}

export interface CategoriaResumoServico{
  categoria: string;
  total: number;
}



