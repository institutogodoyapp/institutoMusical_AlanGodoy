import { Produto } from "../produto";

export enum TipoMovimentacao{
    ENTRADA = 'ENTRADA',
    SAIDA = 'SAIDA'
}
export interface MovimentacaoEstoque{
    produto: Produto;
    quantidade: number;
    tipo: TipoMovimentacao;
    data: string;
}