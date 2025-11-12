import { StatusSoft } from '../../aluno'


export interface CategoriaDespesa {

    id: number;
    nome: string;
    descricao: string;
    ativo: boolean;
    status: StatusSoft;
    despesas: Despesas;  comDespesa?: boolean;
}

export interface Despesas {
    id: number;
    descricao: string;
    ativo: boolean;
    status: StatusSoft;
    data: string;
    valor: number;
    categoria: CategoriaDespesa;
    categoriaNome: string;
    categoriaId: number;
}

export interface DespesasCadastro {
id: number;
    descricao: string;
    data: string;
    valor: number;
    categoriaId: number;

}

export interface CategoriaDespesaCadastro {
    id: number;
    nome: string;
    descricao: string;

}

