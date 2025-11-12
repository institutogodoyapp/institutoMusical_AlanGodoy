import { Mensalidades } from "../mensalidade";


export enum TipoReceita {
    MENSALIDADE = 'MENSALIDADE',
    MATRICULA = 'MATRICULA',
    OUTRAS = 'OUTRAS'
}


export interface Receita {
    id: number;
    descricao: string;
    tipo: TipoReceita;
    data: string;
    valorTotal: number;
    dataRecebimento: string;
    formaPagamento: string;
    mensalidade: Mensalidades;

}




