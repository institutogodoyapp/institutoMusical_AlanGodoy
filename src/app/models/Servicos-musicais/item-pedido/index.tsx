import { Pedido } from "../pedido";
import { Servico } from "../servico";

export interface ItemPedido {
    id: number;
    pedido?: Pedido;
    servico?: Servico;
    servicoId: number;
servicoNome: string;
    quantidade: number;
    precoUnitario: number;
}

export interface ItemPedidoForm {

    pedido: Pedido;
    produtoId: number;
    servico: Servico;
    quantidade: number;
    precoUnitario: number;
}
export interface ItemPedidoFormAdd {


    servico: Servico;
    quantidade: number;
    precoUnitario: number;
}