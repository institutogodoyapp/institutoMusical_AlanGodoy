import { Aluno } from '../../aluno'


export enum StatusMensalidade {
    ABERTA = 'ABERTA',
    PAGA = 'PAGA',
    ATRASADA = 'ATRASADA'
}

export interface StatusMensalidadeHistorico {
    id: number;
    statusAnterior: StatusMensalidade;
    statusNovo: StatusMensalidade;
    dataModificacao: string;
    motivo: string;
    mensalidadeId: number; // Em vez de referência completa, só o ID
}

export interface Mensalidades {
    id: number;
    alunoId?: number; // Em vez de objeto Aluno completo, só o ID
    valor: number;
    dataVencimento: string;
    dataPagamento: string | null; // String ou null se não pago
    ano: string;
    instrumentoNome: string;
    alunoNome: string;
    status: StatusMensalidade; // Corrigido o nome (sem camelCase)
    historicoStatus?: StatusMensalidadeHistorico[]; // Array opcional
}
export interface MensalidadesHistorico {
    dataModificacao: string;
    mensalidade: Mensalidades
    alunoId: number;
    alunoNome:string;
    ativo:boolean
    dataPagamento: string;
    dataUltimaAtualizacao: string
    dataVencimento:string
    instrumentoNome:string
    status: StatusMensalidade
    statusMensalidade: StatusMensalidade
    valor: number
    statusAnterior: StatusMensalidade
    statusNovo: StatusMensalidade

}

export interface Config {
    valorMensalidade: number;
    diaVencimento: number;
    ultimaAtualizacao?: string;
}


export interface ConfigPost {
    valorMensalidade: number;
    diaVencimento: number;

}


