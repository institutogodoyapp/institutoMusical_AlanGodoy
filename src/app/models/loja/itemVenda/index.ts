import { Produto } from "../produto";

export interface itemVenda{
    id: number;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    produto?: Produto;
    produtoNome: string;
    produtoId: number;
}