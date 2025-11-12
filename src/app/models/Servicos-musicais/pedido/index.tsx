import { Cliente } from "../cliente";
import { ItemPedido } from "../item-pedido";

export enum StatusPedido {
    AGENDADO = 'AGENDADO',
    PROCESSANDO = 'PROCESSANDO',
    ENVIADO = 'ENVIADO',
    ENTREGUE = 'ENTREGUE',
    CANCELADO = 'CANCELADO'
}
export interface Pedido {
    id: number;
    cliente?: Cliente
    clienteId: number
    clienteNome?: string
    itens: ItemPedido[];
    dataEntrega?: string;
    previsaoEntrega: string
    dataPedido: string;
    status: StatusPedido
    numeroPedido: string
    valorTotal: number
    observacao: string
}

export interface PedidoForm {
    id: number;
    clienteId: number
     previsaoEntrega: string
    dataPedido: string;
    status: StatusPedido
    numeroPedido: string
    valorTotal: number
}